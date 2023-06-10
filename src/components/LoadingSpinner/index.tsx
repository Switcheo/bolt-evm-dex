import Loader from 'components/Loader';
import React from 'react'
import styled from 'styled-components';

const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`

const LoadingSpinner = () => {
  return (
    <SpinnerContainer>
        <Loader />
        <span>Deploying ERC20...</span>
    </SpinnerContainer>
  )
}

export default LoadingSpinner;