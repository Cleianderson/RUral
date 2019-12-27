import React from 'react'

import { Container, IconStyled, Text } from './styles'

export default function Icon(props) {
  return (
    <Container style={props.style} onPress={props.onPress} >
      <IconStyled name={props.name} />
      <Text>{props.text}</Text>
    </Container>
  )
}
