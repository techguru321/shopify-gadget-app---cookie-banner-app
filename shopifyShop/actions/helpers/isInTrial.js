import { differenceInDays } from 'date-fns';

// a helper function used to check whether or not the store is currently in the trial period
export function isInTrial(appSubscription) {
  const difference = differenceInDays(new Date(appSubscription.currentPeriodEnd), new Date(appSubscription.shopifyCreatedAt));
  console.log(`difference between ${appSubscription.shopifyCreatedAt} and ${appSubscription.currentPeriodEnd} is ${difference} and trial days are ${appSubscription.trialDays}`)
  return difference === appSubscription.trialDays
}
