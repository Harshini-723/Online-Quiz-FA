// Quiz navigation finite-state machine. Invalid actions are rejected.
export const transitions = {
  READY:{START:'ACTIVE'},
  ACTIVE:{NEXT:'ACTIVE',PREVIOUS:'ACTIVE',SELECT_ANSWER:'ACTIVE',SUBMIT:'EVALUATING',TIMEOUT:'EVALUATING',CANCEL:'CANCELLED'},
  EVALUATING:{EVALUATION_COMPLETE:'COMPLETED'},
  COMPLETED:{VIEW_RESULT:'COMPLETED'},
  CANCELLED:{}
};
export function transition(state,event){
  const next=transitions[state]?.[event];
  if(!next) throw new Error(`Invalid transition: ${state} --${event}--> ?`);
  return next;
}
