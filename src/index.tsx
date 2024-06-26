import axios from 'axios';

import AppleHealthKit, {
  type HealthKitPermissions,
  type HealthValue,
} from 'react-native-health';

import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

export function getUser() {
  return axios.get('https://jsonplaceholder.typicode.com/users/1');
}

export function getSteps(): Promise<HealthValue[]> {
  const permissions = {
    permissions: {
      read: [AppleHealthKit.Constants.Permissions.HeartRate],
      write: [AppleHealthKit.Constants.Permissions.Steps],
    },
  } as HealthKitPermissions;

  return new Promise((resolve, reject) => {
    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      if (error) {
        console.log('[ERROR] Cannot grant permissions!');
        reject(error);
        return;
      }

      const options = {
        startDate: new Date(2020, 1, 1).toISOString(),
      };

      AppleHealthKit.getHeartRateSamples(
        options,
        (_callbackError: string, results: HealthValue[]) => {
          if (_callbackError) {
            reject(_callbackError);
          } else {
            resolve(results);
          }
        }
      );
    });
  });
}

export const getActiveCaloriesBurned = async () => {
  const isInitialized = await initialize();

  if (!isInitialized) {
    throw new Error('Initialization failed');
  }

  const grantedPermissions = await requestPermission([
    { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
  ]);

  if (!grantedPermissions) {
    throw new Error('Permission not granted');
  }

  return readRecords('ActiveCaloriesBurned', {
    timeRangeFilter: {
      operator: 'between',
      startTime: '2023-01-09T12:00:00.405Z',
      endTime: '2023-01-09T23:53:15.405Z',
    },
  });
};
