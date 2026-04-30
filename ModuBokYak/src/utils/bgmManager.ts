import Sound from 'react-native-sound';

let bgm: Sound | null = null;

export const bgmManager = {
  play(filename: string = 'bgm.mp3') {
    if (bgm) return;
    bgm = new Sound(filename, Sound.MAIN_BUNDLE, err => {
      if (err) {
        bgm = null;
        return;
      }
      bgm!.setNumberOfLoops(-1);
      bgm!.setVolume(0.6);
      bgm!.play();
    });
  },
  stop() {
    if (!bgm) return;
    bgm.stop(() => {
      bgm?.release();
      bgm = null;
    });
  },
};
