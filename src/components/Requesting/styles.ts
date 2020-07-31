import styled from 'styled-components/native'
import { Animated } from 'react-native'

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-content: center;
    background: rgba(255, 255, 255, 0.7);
`
export const Content = styled(Animated.View)`
    background: #fff;
    padding: 10px;
    margin: 20px;
    border-radius: 7px;
    justify-content: center;
    align-items: center;
    elevation: 5;
`

export const Text = styled(Animated.Text)`
    color: #000;
    font-size: 16px;
    position: absolute;
`

export const ContainerText = styled(Animated.View)`
    position: relative;
    height: 30px;
    justify-content: center;
    align-items: center;
`
