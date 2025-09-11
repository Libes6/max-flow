import React, { useRef } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

interface ConfettiEffectProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const { width, height } = Dimensions.get('window');

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ 
  isVisible, 
  onComplete 
}) => {
  const confettiRef = useRef<ConfettiCannon>(null);

  React.useEffect(() => {
    console.log('ConfettiEffect: useEffect', { isVisible, hasRef: !!confettiRef.current });
    if (isVisible && confettiRef.current) {
      console.log('ConfettiEffect: starting confetti');
      confettiRef.current.start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <ConfettiCannon
      ref={confettiRef}
      count={170}
      origin={{ x: width / 2, y: height / 2 }}
      autoStart={false}
      fadeOut={true}
      onAnimationEnd={onComplete}
      colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']}
      explosion={false}
      fallSpeed={1700}
      spread={30}
    />
  );
};
