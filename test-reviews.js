const { getActivityReviewsAction, getActivityReviewStatsAction } = require('./actions/db/reviews-actions');

async function testReviews() {
  console.log('Testing reviews actions...');
  
  const activityId = '31c37ec9-5a52-4128-ab3f-c89b9b352c9f';
  
  try {
    console.log('Testing getActivityReviewsAction...');
    const reviewsResult = await getActivityReviewsAction(activityId);
    console.log('Reviews result:', JSON.stringify(reviewsResult, null, 2));
    
    console.log('Testing getActivityReviewStatsAction...');
    const statsResult = await getActivityReviewStatsAction(activityId);
    console.log('Stats result:', JSON.stringify(statsResult, null, 2));
  } catch (error) {
    console.error('Error testing reviews:', error);
  }
}

testReviews(); 