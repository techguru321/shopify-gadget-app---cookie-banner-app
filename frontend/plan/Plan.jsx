import { AlphaCard, VerticalStack, Divider } from '@shopify/polaris';
import Header from './Header';
import Feature from './Feature';
import Amount from './Amount';

const Plan = ({
  plan,
  shopId,
  current
}) => {
  const currentName = current?.name ?? 'notsubscribed'
  var isSelectedPlan = currentName.includes(plan.name);
  if (plan.name == "Free" && currentName == "notsubscribed") {
    isSelectedPlan = true;
  }
  else
    isSelectedPlan = currentName.includes(plan.name);

  return (
    <AlphaCard>
      <VerticalStack gap="3">
        <Header
          shopId={shopId}
          plan={plan}
          isCurrent={isSelectedPlan}
        />
        <Divider />
        <VerticalStack inlineAlign="start" gap="1">
          {plan.features.map((feature, index) => {
            return <Feature key={`feature-${index}`} content={feature} />
          })}
        </VerticalStack>
        <Divider />
        <Amount
          currency={"USD"}
          amount={plan.monthlyPrice}
        />
      </VerticalStack>
    </AlphaCard>
  )
};

export default Plan;
