import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F4F7FB',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#132238',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#526071',
    lineHeight: 24,
    marginBottom: 26,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#132238',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#132238',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#EEF3F8',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#132238',
    marginBottom: 18,
  },
  textArea: {
    minHeight: 120,
  },
  serviceTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  serviceTypeOption: {
    minWidth: 110,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#EEF3F8',
    alignItems: 'center',
  },
  serviceTypeOptionSelected: {
    backgroundColor: '#2C8C99',
  },
  serviceTypeOptionText: {
    color: '#29455C',
    fontSize: 14,
    fontWeight: '700',
  },
  serviceTypeOptionTextSelected: {
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#DCEAF4',
  },
  secondaryButtonText: {
    color: '#29455C',
    fontSize: 15,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#2C8C99',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
