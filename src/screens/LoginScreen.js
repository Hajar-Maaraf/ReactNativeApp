import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      let message = 'Une erreur est survenue.';
      if (error.code === 'auth/user-not-found') message = 'Aucun compte trouvé.';
      else if (error.code === 'auth/wrong-password') message = 'Mot de passe incorrect.';
      else if (error.code === 'auth/invalid-email') message = 'Email invalide.';
      else if (error.code === 'auth/invalid-credential') message = 'Email ou mot de passe incorrect.';
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <View style={styles.content}>
        <View style={styles.logoSection}>
          <Text style={styles.logoEmoji}>🌸</Text>
          <Text style={styles.title}>SweetBloom</Text>
          <Text style={styles.tagline}>Fleurs • Chocolats • Gâteaux</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Bienvenue !</Text>
          <Text style={styles.formSubtitle}>Connectez-vous pour continuer</Text>

          <View style={[styles.inputContainer, emailFocused && styles.inputFocused]}>
            <Ionicons name="mail-outline" size={20} color="#E91E63" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#B0B0B0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          <View style={[styles.inputContainer, passwordFocused && styles.inputFocused]}>
            <Ionicons name="lock-closed-outline" size={20} color="#E91E63" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#B0B0B0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={showPassword === false}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>
              Pas de compte ? <Text style={styles.linkTextBold}>S'inscrire</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF2F4' },
  decorCircle1: { position: 'absolute', top: -100, right: -100, width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(233, 30, 99, 0.08)' },
  decorCircle2: { position: 'absolute', bottom: 50, left: -80, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(233, 30, 99, 0.05)' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoEmoji: { fontSize: 70 },
  title: { fontSize: 42, fontWeight: '800', color: '#E91E63' },
  tagline: { fontSize: 14, color: '#999', marginTop: 6 },
  formSection: { backgroundColor: '#fff', borderRadius: 28, padding: 24, elevation: 12 },
  formTitle: { fontSize: 26, fontWeight: '800', color: '#2D3436', marginBottom: 4 },
  formSubtitle: { fontSize: 14, color: '#999', marginBottom: 24 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 16, marginBottom: 16, paddingHorizontal: 16, paddingVertical: 4, borderWidth: 2, borderColor: 'transparent' },
  inputFocused: { borderColor: '#E91E63', backgroundColor: '#FFF5F7' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#2D3436' },
  button: { backgroundColor: '#E91E63', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  linkButton: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#666', fontSize: 15 },
  linkTextBold: { color: '#E91E63', fontWeight: '700' },
});
