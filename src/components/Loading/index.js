import React, { useEffect } from 'react'
import { Animated, Modal, ActivityIndicator } from 'react-native'
import { Content, Message } from './styles'

let cor='#', 
  letras=['0','1','2','3','4','5','7','8','9','a','b','c','d','e','f']
  
for(let x = 0;x<3;x++){
  let num = Math.floor(((15-0)+0)*Math.random())
  cor+=letras[num]
}

export default function Loading({ vars, title }) {
  const valueOfHeight = new Animated.Value(150)
  const valueOfAnimate = new Animated.Value(0)

  useEffect(() => {
    if (vars[0]) {
      Animated.timing(valueOfHeight, {
        toValue: 40,
        delay: 100,
        duration: 600
      }).start()
    }
    Animated.spring(valueOfAnimate,{
      toValue:1,
      delay: 100,
      speed:1
    }).start()
  }, [vars[0]])

  return (
    <Modal
      transparent={true}
      visible={vars[0] || !vars[1]}
    >
      <Content style={{ 
        maxHeight: valueOfHeight,
        scaleX: valueOfAnimate,
        scaleY: valueOfAnimate }}
      >
        <Animated.View style={{
          background: 'transparent',
          maxHeight: valueOfHeight.interpolate(
            {
              inputRange: [40, 150],
              outputRange: [0, 100]
            }
          ),
          opacity: valueOfHeight.interpolate(
            {
              inputRange: [40, 150],
              outputRange: [0, 1]
            }
          )
        }}>
          <ActivityIndicator
            style={{ marginBottom: 7}}
            size={80}
            color={cor}
          />
        </Animated.View>
        <Message style={{
          color: valueOfHeight.interpolate(
            {
              inputRange: [40, 150],
              outputRange: ['#f00', '#999']
            }
          )
        }} error={vars[0]}>
          {title}
        </Message>
      </Content>
    </Modal>
  )
}
