import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#E91E63',
  primarySoft: 'rgba(233, 30, 99, 0.1)',
  background: '#FDF2F4',
  text: '#2D3436',
  textSecondary: '#636E72',
};

export default function LoadingSpinner({ 
  size = 'medium', // small, medium, large
  color = COLORS.primary, 
  text,
  subtext,
  variant = 'default', // default, overlay, inline
  icon,
}) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotation animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { spinner: 30, container: 50, icon: 20, text: 12 };
      case 'large':
        return { spinner: 60, container: 100, icon: 40, text: 16 };
      default: // medium
        return { spinner: 40, container: 80, icon: 28, text: 14 };
    }
  };

  const sizeConfig = getSizeConfig();

  if (variant === 'inline') {
    return (
      <View style={styles.inlineContainer}>
        <ActivityIndicator size="small" color={color} />
        {text && <Text style={styles.inlineText}>{text}</Text>}
      </View>
    );
  }

  if (variant === 'overlay') {
    return (
      <View style={styles.overlayContainer}>
        <View style={styles.overlayContent}>
          <Animated.View 
            style={[
              styles.spinnerContainer,
              { 
                width: sizeConfig.container, 
                height: sizeConfig.container,
                transform: [{ scale: pulseAnim }],
              }
            ]}
          >
            {icon ? (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Ionicons name={icon} size={sizeConfig.icon} color={color} />
              </Animated.View>
            ) : (
              <ActivityIndicator size="large" color={color} />
            )}
          </Animated.View>
          {text && <Text style={[styles.text, { fontSize: sizeConfig.text }]}>{text}</Text>}
          {subtext && <Text style={styles.subtext}>{subtext}</Text>}
        </View>
      </View>
    );
  }

  // Default variant
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.spinnerContainer,
          { 
            width: sizeConfig.container, 
            height: sizeConfig.container,
            transform: [{ scale: pulseAnim }],
          }
        ]}
      >
        {icon ? (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons name={icon} size={sizeConfig.icon} color={color} />
          </Animated.View>
        ) : (
          <ActivityIndicator size="large" color={color} />
        )}
      </Animated.View>
      {text && <Text style={[styles.text, { fontSize: sizeConfig.text }]}>{text}</Text>}
      {subtext && <Text style={styles.subtext}>{subtext}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  spinnerContainer: {
    borderRadius: 40,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  text: {
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtext: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  inlineText: {
    marginLeft: 10,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  overlayContent: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
});
