import {Container, ContainerConfig} from './container';
import {HugePlaybackToggleButton} from './hugeplaybacktogglebutton';
import {Spacer} from './spacer';
import {PlaybackToggleButton} from './playbacktogglebutton';
import {PlayerAPI} from 'bitmovin-player';
import {UIInstanceManager} from '../uimanager';
import {QuickSeekButton} from './quickseekbutton';
import {ToggleButton, ToggleButtonConfig} from './togglebutton';

export interface PlaybackToggleOverlayConfig extends ContainerConfig {
  /**
   * Specify whether the player should be set to enter fullscreen by clicking on the playback toggle button
   * when initiating the initial playback.
   * Default is false.
   */
  enterFullscreenOnInitialPlayback?: boolean;
}

/**
 * Overlays the player and displays error messages.
 */
export class PlaybackToggleOverlay extends Container<PlaybackToggleOverlayConfig> {

  constructor(config: PlaybackToggleOverlayConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-playbacktoggle-overlay',
    }, this.config);
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager) {
    super.configure(player, uimanager);
  }
}

export class TileOverlay extends Container<ContainerConfig> {
  constructor(config: ContainerConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-tile-overlay',
        components: [
            new TileSelectButton({tileIndex: 0}),
            new TileSelectButton({tileIndex: 1}),
            new TileSelectButton({tileIndex: 2}),
            new TileSelectButton({tileIndex: 3}),
        ],
    }, this.config);
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager) {
    super.configure(player, uimanager);

    uimanager.onControlsShow.subscribe(() => {
      this.show();
    });

    uimanager.onControlsHide.subscribe(() => {
      this.hide();
    });
  }
}

export interface TileSelectButtonConfig extends ToggleButtonConfig {
  tileIndex?: number;
}

declare const window: any;

interface CallbackInterface {
  (data?: string): void;
}

interface CustomMessageHandlerApi {
  sendSynchronous(name: string, data?: string): string | null;
  sendAsynchronous(name: string, data?: string): void;
  on(methodName: string, callback: CallbackInterface): void;
}

export class TileSelectButton extends ToggleButton<TileSelectButtonConfig> {
  constructor(config: TileSelectButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
        cssClass: 'ui-tile-select-button',
    }, this.config);
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager) {
    super.configure(player, uimanager);

    player.on('tileSelected' as any, (event) => {
      if ((event as any).tileIndex === null) {
        this.off();
      }
    });

    this.onClick.subscribe(() => {
      if (this.isOn()) {
        this.off();

        (uimanager as any).getWrappedPlayer().fireEventInUI('tileSelected', { tileIndex: null });

        if (window.bitmovin.customMessageHandler) {
          window.bitmovin.customMessageHandler.sendSynchronous(
            'openGrid',
          );
        }
      } else {
        this.on();

        (uimanager as any).getWrappedPlayer().fireEventInUI('tileSelected', { tileIndex: this.config.tileIndex });

        if (window.bitmovin.customMessageHandler) {
          window.bitmovin.customMessageHandler.sendSynchronous(
            'selectTile',
            JSON.stringify({ tileIndex: this.config.tileIndex }),
          );
        }
      }
    });
  }
}

export class GridToggleButton extends ToggleButton<ToggleButtonConfig> {
  constructor(config: ToggleButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-grid-toggle-button',
    }, this.config);
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager) {
    super.configure(player, uimanager);

    this.hide();

    player.on('tileSelected' as any, (event) => {
      if ((event as any).tileIndex === null) {
        this.hide();
      } else {
        this.show();
      }
    });

    this.onClick.subscribe(() => {
      (uimanager as any).getWrappedPlayer().fireEventInUI('tileSelected', { tileIndex: null });

      if (window.bitmovin.customMessageHandler) {
        window.bitmovin.customMessageHandler.sendSynchronous(
          'openGrid',
        );
      }
    });
  }
}

export class SidebarToggleButton extends ToggleButton<ToggleButtonConfig> {
  constructor(config: ToggleButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-sidebar-toggle-button',
    }, this.config);
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager) {
    super.configure(player, uimanager);

    this.hide();

    player.on('tileSelected' as any, (event) => {
      if ((event as any).tileIndex === null) {
        this.hide();
      } else {
        this.show();
      }
    });

    this.onClick.subscribe(() => {
      if (this.isOn()) {
        this.off();

        if (window.bitmovin.customMessageHandler) {
          window.bitmovin.customMessageHandler.sendSynchronous(
            'closeSidebar',
          );
        }
      } else {
        this.on();

        if (window.bitmovin.customMessageHandler) {
          window.bitmovin.customMessageHandler.sendSynchronous(
            'openSidebar',
          );
        }
      }
    });

    if (window.bitmovin.customMessageHandler) {
      window.bitmovin.customMessageHandler.on('toggleSidebarButton', (data?: string) => {
        if (this.isOn()) {
          this.off();
        } else {
          this.on();
        }
      });
    }
  }
}
