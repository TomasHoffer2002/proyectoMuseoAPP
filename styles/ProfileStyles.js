import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 48,
  },
  badge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    fontSize: 32,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  benefitCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  benefitInfo: {
    flex: 1,
  },
  benefitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
  },
  benefitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  costText: {
    fontSize: 16,
    fontWeight: '600',
  },
  unlockButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  unlockButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  unlockedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  unlockedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  themeToggle: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  themeButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeThemeIndicator: {
    fontSize: 16,
  },
  buyCoinsButton: {
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buyCoinsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyCoinsIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  buyCoinsText: {
    fontSize: 18,
    fontWeight: '700',
  },
});