import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, FONT_SIZE } from '@/constants';
import { formatCount } from '@/utils/format';
import type { User } from '@/types';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onEditProfile?: () => void;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
}

export function ProfileHeader({
  user,
  isOwnProfile,
  isFollowing,
  onFollow,
  onEditProfile,
  onFollowersPress,
  onFollowingPress,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Cover Photo */}
      <View style={styles.coverContainer}>
        {user.coverPhotoUrl ? (
          <Image
            source={{ uri: user.coverPhotoUrl }}
            style={styles.coverImage}
            contentFit="cover"
          />
        ) : (
          <View style={styles.coverPlaceholder} />
        )}
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={styles.avatarRow}>
          <Avatar uri={user.profilePhotoUrl} name={user.displayName} size={80} />
          {isOwnProfile ? (
            <Button title="Edit Profile" onPress={onEditProfile!} variant="outline" size="sm" />
          ) : (
            <Button
              title={isFollowing ? 'Following' : 'Follow'}
              onPress={onFollow!}
              variant={isFollowing ? 'outline' : 'primary'}
              size="sm"
            />
          )}
        </View>

        <Text style={styles.displayName}>{user.displayName}</Text>
        {user.isVerified && <Text style={styles.verified}> Verified</Text>}
        {user.bio.length > 0 && <Text style={styles.bio}>{user.bio}</Text>}

        {/* Stats */}
        <View style={styles.stats}>
          <TouchableOpacity onPress={onFollowersPress} style={styles.statItem}>
            <Text style={styles.statCount}>{formatCount(user.followersCount)}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onFollowingPress} style={styles.statItem}>
            <Text style={styles.statCount}>{formatCount(user.followingCount)}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </TouchableOpacity>
          <View style={styles.statItem}>
            <Text style={styles.statCount}>{formatCount(user.postsCount)}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  coverContainer: {
    height: 150,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
    opacity: 0.3,
  },
  profileSection: {
    padding: SPACING.lg,
    marginTop: -30,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  displayName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  verified: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
  },
  bio: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 20,
    marginTop: SPACING.xs,
  },
  stats: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
  },
  statItem: {
    marginRight: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCount: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginRight: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
});
