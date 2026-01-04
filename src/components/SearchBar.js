import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#E91E63',
  primarySoft: 'rgba(233, 30, 99, 0.1)',
  surface: '#FFFFFF',
  text: '#2D3436',
  placeholder: '#999999',
  border: 'transparent',
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Rechercher...',
  onSubmit,
  onFocus,
  onBlur,
  autoFocus = false,
  showCancelButton = false,
  onCancel,
  style,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const widthAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
    
    if (showCancelButton) {
      Animated.spring(widthAnim, {
        toValue: 0.85,
        tension: 50,
        friction: 10,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
    
    if (showCancelButton && !value) {
      Animated.spring(widthAnim, {
        toValue: 1,
        tension: 50,
        friction: 10,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleCancel = () => {
    inputRef.current?.blur();
    onChangeText?.('');
    onCancel?.();
    
    Animated.spring(widthAnim, {
      toValue: 1,
      tension: 50,
      friction: 10,
      useNativeDriver: false,
    }).start();
  };

  const handleClear = () => {
    onChangeText?.('');
    inputRef.current?.focus();
  };

  const containerWidth = widthAnim.interpolate({
    inputRange: [0.85, 1],
    outputRange: ['85%', '100%'],
  });

  return (
    <View style={[styles.wrapper, style]}>
      <Animated.View 
        style={[
          styles.container,
          isFocused && styles.containerFocused,
          showCancelButton && { width: containerWidth },
        ]}
      >
        <View style={[styles.iconWrapper, isFocused && styles.iconWrapperFocused]}>
          <Ionicons 
            name="search" 
            size={18} 
            color={isFocused ? '#fff' : COLORS.primary} 
          />
        </View>
        
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmit}
          autoFocus={autoFocus}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {value?.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </Animated.View>

      {showCancelButton && isFocused && (
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Ionicons name="close" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  containerFocused: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperFocused: {
    backgroundColor: COLORS.primary,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  clearButton: {
    padding: 8,
  },
  cancelButton: {
    paddingLeft: 12,
    paddingVertical: 10,
  },
});
