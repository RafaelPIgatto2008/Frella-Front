import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  sidebar: {
    width: 108,
    backgroundColor: '#132238',
    paddingHorizontal: 14,
    paddingTop: 30,
    paddingBottom: 22,
    justifyContent: 'space-between',
  },
  profileSection: {
    alignItems: 'center',
    gap: 8,
  },
  profileSectionPressable: {
    borderRadius: 16,
    paddingVertical: 8,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2C8C99',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  profileRole: {
    color: '#AFC1D7',
    fontSize: 12,
  },
  navigationSection: {
    gap: 12,
  },
  navItem: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
  },
  navItemActive: {
    backgroundColor: '#203855',
  },
  navIcon: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  navText: {
    color: '#C6D2E1',
    fontSize: 12,
    fontWeight: '600',
  },
  navTextActive: {
    color: '#FFFFFF',
  },
  logoutButton: {
    backgroundColor: '#203855',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
