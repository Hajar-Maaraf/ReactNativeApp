import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#E91E63',
  primarySoft: 'rgba(233, 30, 99, 0.1)',
  border: '#E8E8E8',
  borderFocused: '#E91E63',
  background: '#FFFFFF',
  text: '#2D3436',
  placeholder: '#999999',
  error: '#F44336',
  errorBg: '#FFEBEE',
  success: '#4CAF50',
  label: '#636E72',
};

export default function Input({ 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry,
  label,
  error,
  success,
  helperText,
  icon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
  style,
  inputStyle,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(focusAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(focusAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: false,
    }).start();
  };

  const getBorderColor = () => {
    if (error) return COLORS.error;
    if (success) return COLORS.success;
    if (isFocused) return COLORS.borderFocused;
    return COLORS.border;
  };

  const getBackgroundColor = () => {
    if (error) return COLORS.errorBg;
    if (!editable) return '#F5F5F5';
    return COLORS.background;
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? COLORS.error : COLORS.border, error ? COLORS.error : COLORS.borderFocused],
  });

  const isPassword = secureTextEntry && !showPassword;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>
          {label}
        </Text>
      )}
      
      <Animated.View 
        style={[
          styles.inputWrapper,
          { 
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
          },
          isFocused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
          multiline && styles.inputWrapperMultiline,
        ]}
      >
        {icon && (
          <View style={[styles.iconWrapper, isFocused && styles.iconWrapperFocused]}>
            <Ionicons 
              name={icon} 
              size={20} 
              color={isFocused ? COLORS.primary : COLORS.placeholder} 
            />
          </View>
        )}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          secureTextEntry={isPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            multiline && styles.inputMultiline,
            inputStyle,
          ]}
        />

        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color={COLORS.placeholder} 
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity 
            style={styles.rightIconWrapper}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <Ionicons 
              name={rightIcon} 
              size={20} 
              color={success ? COLORS.success : error ? COLORS.error : COLORS.placeholder} 
            />
          </TouchableOpacity>
        )}
      </Animated.View>

      {(helperText || error) && (
        <View style={styles.helperContainer}>
          {error && <Ionicons name="alert-circle" size={14} color={COLORS.error} style={styles.helperIcon} />}
          <Text style={[styles.helperText, error && styles.helperTextError]}>
            {error || helperText}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.label,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  labelError: {
    color: COLORS.error,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  inputWrapperFocused: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorBg,
  },
  inputWrapperMultiline: {
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primarySoft,
    borderRadius: 12,
    marginLeft: 6,
  },
  iconWrapperFocused: {
    backgroundColor: COLORS.primary,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: COLORS.text,
  },
  inputWithIcon: {
    paddingLeft: 12,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  passwordToggle: {
    padding: 12,
  },
  rightIconWrapper: {
    padding: 12,
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  helperIcon: {
    marginRight: 4,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.placeholder,
  },
  helperTextError: {
    color: COLORS.error,
  },
});
