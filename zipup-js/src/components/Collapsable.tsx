import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";

type Callback = (active: boolean, cb: Dispatch<SetStateAction<boolean>>) => ReactNode;

interface Props {
  children: ReactNode
  actionable: Callback
  expanded: boolean
}

export const SimpleCollapsable = ({children, actionable, expanded}: Props) => {
  const [state, dispatch] = useState(expanded);
  return (
    <div>
      { actionable(state, dispatch) }
      { state && children }
    </div>
  )
};