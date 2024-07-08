import {Container, ContainerConfig} from './container';
import {HugePlaybackToggleButton} from './hugeplaybacktogglebutton';
import {Spacer} from './spacer';
import {PlaybackToggleButton} from './playbacktogglebutton';
import {PlayerAPI} from 'bitmovin-player';
import {UIInstanceManager} from '../uimanager';
import {QuickSeekButton} from './quickseekbutton';

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
