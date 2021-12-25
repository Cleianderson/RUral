import 'react-native-gesture-handler'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import OneSignal from 'react-native-onesignal'
import NetInfo from '@react-native-community/netinfo'

import { Container } from './styles'

import api from './service/Api'
import { updateWeekStorage, getItem, setItem } from './service/Storage'

import Main from './routes/Main'

const isoWeekOfTomorrow = moment().add(1, 'days').isoWeek()

const App: React.FC = () => {
  const dispatch = useDispatch()

  const favorites = useSelector<RootState, string[] | undefined>(state => state.mainState.favorites)
  const warns = useSelector<RootState, WarningType[] | undefined>(state => state.mainState.warns)

  const setFoods = (foods: any) => dispatch({ type: 'SET_FOODS', payload: { foods } })
  const setWarns = (warns: any) => dispatch({ type: 'SET_WARNS', payload: { warns } })
  const setFavorites = (favorites: any) => dispatch({ type: 'SET_FAVORITES', payload: { favorites } })
  const setThereIsWarn = (thereIsWarn: boolean) => dispatch({ type: 'SET_THERE_IS_WARNS', payload: { thereIsWarn } })

  const setAction = (fn: Function) => dispatch({ type: 'SET_ACTION', payload: { action: fn } })
  const setTextFailed = (str: string) => dispatch({ type: 'SET_TEXT_FAILED', payload: { textFailed: str } })
  const setTextSuccess = (str: string) => dispatch({ type: 'SET_TEXT_SUCCESS', payload: { textSuccess: str } })

  async function initFavorites () {
    // -> Método responsável por iniciar a lista de favoritos
    const favorites = (await getItem<string[]>('@favorites')).data
    setFavorites(favorites !== null ? favorites : [])
  }

  const checkWeek = async () => {
    // -> Método responsável por iniciar os dados do cardápio
    const weekFromStorage = await getItem<Week>('@week')
    const jsonStorage = weekFromStorage.data

    if (jsonStorage === null || isoWeekOfTomorrow !== jsonStorage.number_week) {
      setAction(verifyConnectionAndRefresh)
    } else {
      setFoods(jsonStorage.data || [])
    }
  }
  const verifyConnectionAndRefresh = async () => {
    if ((await NetInfo.fetch()).isConnected) {
      setTextFailed('O cardápio ainda não está disponível')
      setTextSuccess('Cardápio atualizado!')
      setAction(async () => {
        const { data } = await api.get(`/thisweek?week=${isoWeekOfTomorrow}`)
        await verifyWarn()
        if (data) {
          updateWeekStorage(data.data, { number_week: data.number_week })
          setFoods(data.data)
          return true
        }
        return false
      })
    } else {
      setTextFailed('Falha na conexão')
      return false
    }
  }

  const verifyWarn = async () => {
    // -> Verifica se as notificações locais e do servidor são iguais
    if ((await NetInfo.fetch()).isConnected) {
      const warnsResolve = await api.get<WarningType[]>('/warn')
      const warnsFromStorage = await getItem<WarningType[]>('@warns')

      let warnsStorage = warnsFromStorage.data

      if (warnsStorage === null) {
        await setItem('@warns', { data: warnsResolve.data })
        warnsStorage = warnsResolve.data
      }

      const resolveIds = warnsResolve.data.map((w) => w._id)
      const storageIds = warnsStorage.map((w) => w._id)

      const thereIsNewWarn = !resolveIds.every((resolveId) => storageIds.includes(resolveId))

      await setItem('@warns', { data: warnsResolve.data })
      setWarns(warnsResolve.data)

      if (thereIsNewWarn) {
        setThereIsWarn(true)
        setItem('@thereIsWarn', { value: true })
      }
    }
  }

  const startWarning = async () => {
    // -> Método responsável por iniciar os avisos
    const warnsFromStorage = await getItem<WarningType[]>('@warns')
    const warnsStorage = warnsFromStorage.data
    setWarns(warnsStorage || [] as WarningType[])

    const thereIsNewWarn = await getItem<boolean>('@thereIsWarn')
    setThereIsWarn((thereIsNewWarn.data || false))

    verifyWarn()
  }

  useEffect(() => {
    const initalizeOneSignal = async () => {
      OneSignal.setRequiresUserPrivacyConsent(true)

      const value = (await getItem<boolean>('@RUral:oneSignal')).data || false

      OneSignal.provideUserConsent(value)

      OneSignal.init('85b3451d-6f7d-481f-b66e-1f93fe069135')
      OneSignal.addEventListener('received', async (pushNot: any) => {
        await setItem('@warns', { data: pushNot.payload.additionalData.warns })
        setWarns(pushNot.payload.additionalData.warns)
        setThereIsWarn(true)
        await setItem('@thereIsWarn', { data: true })
      })
    }

    initalizeOneSignal()
    initFavorites()
    checkWeek()
    startWarning()
  }, [])

  useEffect(() => {
    if (favorites !== undefined) {
      const writeFavorites = async () => (await setItem('@favorites', { data: favorites }))
      writeFavorites()
    }
  }, [favorites])

  useEffect(() => {
    const writeWarns = async () => (await setItem('@warns', { data: warns }))
    writeWarns()
  }, [warns])

  return (
    <Container>
      <Main />
    </Container>
  )
}

export default App
