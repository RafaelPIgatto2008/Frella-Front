import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/lateralBarStyle';

export default function LateralBar({
  profileInitials = 'US',
  profileName = 'User',
  profileRole = 'Seu perfil',
  navigationItems = [],
  onProfilePress,
  onLogout,
}) {
  return (
    <View style={styles.sidebar}>
      <TouchableOpacity
        style={[styles.profileSection, onProfilePress && styles.profileSectionPressable]}
        onPress={onProfilePress}
        disabled={!onProfilePress}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profileInitials}</Text>
        </View>
        <Text style={styles.profileName}>{profileName}</Text>
        <Text style={styles.profileRole}>{profileRole}</Text>
      </TouchableOpacity>

      <View style={styles.navigationSection}>
        {navigationItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.navItem, item.active && styles.navItemActive]}
            onPress={item.onPress}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navText, item.active && styles.navTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
