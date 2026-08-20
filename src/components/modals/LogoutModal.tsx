import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import * as Haptics from 'expo-haptics';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDark: boolean;
}

const { width } = Dimensions.get('window');

export const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onClose,
  onConfirm,
  isDark,
}) => {
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  const handleConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onConfirm();
  };

  const handleCancel = () => {
    Haptics.selectionAsync();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={handleCancel}>
        <Pressable 
          style={[
            styles.modalCard, 
            { 
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
            }
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Glowing Red Icon */}
          <View style={styles.iconWrapper}>
            <View style={[styles.iconOuterRing, { backgroundColor: '#EF444415' }]}>
              <View style={[styles.iconInnerRing, { backgroundColor: '#EF444425' }]}>
                <Ionicons name="log-out" size={32} color="#EF4444" />
              </View>
            </View>
          </View>

          {/* Title & Body */}
          <Text style={[styles.title, { color: colors.text }]}>Log Out of LifeSync?</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            Are you sure you want to log out? All your habits, tasks, and personal data remain safely preserved on this device.
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.logoutButton, { backgroundColor: '#EF4444' }]}
              onPress={handleConfirm}
              activeOpacity={0.85}
            >
              <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.cancelButton, 
                { 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'
                }
              ]}
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Stay Logged In</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalCard: {
    width: Math.min(width - 40, 360),
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  iconWrapper: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOuterRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInnerRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: 'center',
    marginBottom: 8,
    includeFontPadding: false,
  },
  message: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 8,
    includeFontPadding: false,
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  cancelButton: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.semiBold,
    includeFontPadding: false,
  },
});
