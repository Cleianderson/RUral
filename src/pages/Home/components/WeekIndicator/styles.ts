import styled from 'styled-components/native'

export const Container = styled.View`
  /* border: 1px solid; */
  padding: 10px 0px;
  /* background: #fff; */
`

export const Content = styled.View`
  flex-direction: row;
  justify-content: space-around;
`

export const Button = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  /* background: #eee; */
  padding: 2px 15px;
  /* border-radius: 10px; */
  border: 0px solid #ccc;

`

export const BText = styled.Text`
  text-align: center;
  font-weight: bold;
  color: ${({ selected }) => (selected ? '#f9b233' : '#999')};
`
