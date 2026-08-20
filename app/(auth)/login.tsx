import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { useAppStore } from '../../src/store/useAppStore';
import { useRouter, Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { setIsAuthenticated, setUserInfo, userName, userEmail } = useAppStore();
  const router = useRouter();
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);
  const [hasBiometrics, setHasBiometrics] = useState(false);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: userEmail || '', password: '' },
  });

  useEffect(() => {
    if (userEmail) {
      setValue('email', userEmail);
    }
    (async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setHasBiometrics(compatible && enrolled);
      } catch (e) {}
    })();
  }, [userEmail]);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Set user info if not already present
    const derivedName = userName ? userName : data.email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
    setUserInfo(formattedName, data.email.trim());
    setIsAuthenticated(true);
    router.replace('/(tabs)');
  };

  const handleBiometricLogin = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (compatible && enrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Unlock LifeSync',
          fallbackLabel: 'Use Password',
          cancelLabel: 'Cancel',
        });

        if (result.success) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          // If the user already registered earlier, keep their saved name; otherwise default gracefully
          if (!userName) {
            setUserInfo('LifeSync User', userEmail || 'user@lifesync.app');
          }
          setIsAuthenticated(true);
          router.replace('/(tabs)');
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      } else {
        alert('Biometric authentication is not set up on this device.');
      }
    } catch (e) {
      console.log('Biometric auth error', e);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom + 16, 24) }]} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Branding & Logo Header */}
        <View style={styles.header}>
          <View style={[
            styles.logoContainer, 
            { 
              backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF',
              borderColor: isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.25)',
            }
          ]}>
            <Image 
              source={require('../../assets/images/icon.png')} 
              style={styles.logo} 
              resizeMode="cover"
            />
          </View>
          <Text style={[styles.appName, { color: colors.primary }]}>LifeSync</Text>
          <Text style={[styles.title, { color: colors.text }]}>
            {userName ? `Welcome Back, ${userName} 👋` : 'Welcome Back 👋'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to sync your habits, tasks & goals
          </Text>
        </View>

        {/* Credentials Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="Enter your email"
                autoCapitalize="none"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
                isDark={isDark}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
                isDark={isDark}
              />
            )}
          />

          <Button 
            title={isLoading ? "Logging in..." : "Sign In"} 
            onPress={handleSubmit(handleLogin)} 
            style={styles.button}
            isDark={isDark}
            disabled={isLoading}
          />

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textTertiary }]}>OR QUICK ACCESS</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Biometrics Action Button */}
          <TouchableOpacity 
            style={[
              styles.biometricBtn, 
              { 
                borderColor: colors.border,
                backgroundColor: isDark ? 'rgba(79, 70, 229, 0.08)' : 'rgba(79, 70, 229, 0.04)'
              }
            ]} 
            onPress={handleBiometricLogin}
            activeOpacity={0.7}
          >
            <View style={[styles.biometricIconBox, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="finger-print" size={26} color={colors.primary} />
            </View>
            <View style={styles.biometricTextBox}>
              <Text style={[styles.biometricTitle, { color: colors.text }]}>Unlock with Biometrics</Text>
              <Text style={[styles.biometricSub, { color: colors.textSecondary }]}>
                {userName ? `Instant login as ${userName}` : 'Fast & secure fingerprint / face login'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>

          {/* Security Assurance Badge */}
          <View style={[styles.securityBadge, { backgroundColor: colors.surfaceHighlight || 'rgba(128,128,128,0.06)' }]}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#10B981" />
            <Text style={[styles.securityText, { color: colors.textSecondary }]}>
              Your data is encrypted & safely stored on your device
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.xs,
  },
  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 22,
    padding: 3,
    borderWidth: 1.5,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  appName: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
    includeFontPadding: false,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 4,
    textAlign: 'center',
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: 'center',
    includeFontPadding: false,
  },
  form: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  button: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.semiBold,
    paddingHorizontal: 12,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.radius.xl,
    borderWidth: 1.5,
    marginBottom: theme.spacing.lg,
  },
  biometricIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  biometricTextBox: {
    flex: 1,
  },
  biometricTitle: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 2,
    includeFontPadding: false,
  },
  biometricSub: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.regular,
    includeFontPadding: false,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radius.lg,
    gap: 8,
    justifyContent: 'center',
  },
  securityText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    flexShrink: 1,
    includeFontPadding: false,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginTop: 'auto',
  },
  footerText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    includeFontPadding: false,
  },
  footerLink: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
});
