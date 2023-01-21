import { StatusBar } from 'expo-status-bar'
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Button,
  Touchable,
} from 'react-native'
import { Calendar } from './Components/Calendar'
import { FloatingButton } from './Components/FloatingButton'
import { useEffect, useState } from 'react'
import { stickers, utilStickers } from './icons/exports'
import TrashSolid from './icons/trash-solid.svg'
import { StickerSelect } from './Components/StickerSelect'
import MenuDrawer from 'react-native-side-drawer'
import * as SQLite from 'expo-sqlite'

export default function App() {
  const [db, setDb] = useState(SQLite.openDatabase('octs.db'))
  const [isLoading, setIsLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [stickerList, setStickerList] = useState([])

  useEffect(() => {
    if (db) {
      db.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS stickers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, value INT)',
          null,
          (txObj, resultSet) => {
            console.log(`resultSet: ${JSON.stringify(resultSet)}`)
          },
          (txObj, error) => console.log(`error: ${JSON.stringify(error)}`),
        )
      })
      console.log(`not completed`)

      db.transaction((tx) => {
        tx.executeSql(
          'select distinct value from stickers',
          null,
          (txObj, resultSet) => {
            console.log(
              `resultSet.rows._array: ${JSON.stringify(resultSet.rows._array)}`,
            )
            setStickerList(resultSet.rows._array.map((thing) => thing.value))
          },
          (txObj, error) => console.log(`error: ${JSON.stringify(error)}`),
        )
      })

      setIsLoading(false)
    } else {
      console.log(`db isnt working: ${db}`)
    }
  }, [db])

  const handleDeleteSticker = (val) => {
    if (db) {
      db.transaction((tx) => {
        tx.executeSql(
          `delete from stickers where value = ?`,
          [val],
          (_, result) => {
            console.log(`result.rowsAffected on delete: ${result.rowsAffected}`)
            setStickerList((prev) => prev.filter((item) => item !== +val))
          },
        )
      })
    }
  }

  const renderStickerLine = ({ item }) => {
    const Sticker = stickers[item]
    return (
      <View style={styles.stickeLine}>
        <Sticker height={30} width={30} />
        <TextInput
          style={styles.stickerInput}
          placeholder="Set Sticker Name..."
        />
        <TouchableHighlight
          style={{
            backgroundColor: 'rgba(100,100,100,0.8)',
            padding: 5,
            borderRadius: 90,
          }}
          onPress={() => handleDeleteSticker(item)}
        >
          <TrashSolid height={20} width={20} fill={'rgba(0,0,0,1)'} />
        </TouchableHighlight>
      </View>
    )
  }

  const drawerContent = (
    <View style={styles.sideMenu}>
      <Text style={styles.modalText}>Your Stickers</Text>
      <View
        style={{
          marginLeft: 2,
          borderWidth: 1,
          borderColor: 'grey',
          height: 230,
          width: 250,
          marginBottom: 20,
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView2}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.containerStyles}
            >
              {Object.keys(stickers).map((key) => {
                const Sticker = stickers[key]
                return (
                  <StickerSelect
                    setStickerList={setStickerList}
                    value={key}
                    key={key}
                    db={db}
                    stickerList={stickerList}
                  >
                    <Sticker width={40} height={40} key={key} />
                  </StickerSelect>
                )
              })}
            </ScrollView>
          </View>
        </View>
      </View>
      <View style={styles.textandlist}>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'grey',
            height: 300,
            width: 250,
          }}
        >
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <FlatList
              data={stickerList}
              renderItem={renderStickerLine}
              keyExtractor={(item) => item}
              keyboardDismissMode="on-drag"
            />
          )}
        </View>
      </View>

      <TouchableHighlight
        style={[styles.button, styles.buttonClose]}
        onPress={() => setShowMenu(!showMenu)}
      >
        <Text style={styles.textStyle}>X</Text>
      </TouchableHighlight>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent={false} />
      <Calendar />
      <FloatingButton showMenu={showMenu} setShowMenu={setShowMenu} />

      <MenuDrawer
        open={showMenu}
        drawerContent={drawerContent}
        drawerPercentage={80}
        animationTime={250}
      ></MenuDrawer>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(50,50,50,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sticker: {
    backgroundColor: 'rgba(100,100,100,0.9)',
    borderRadius: 10,
    padding: 10,
    margin: 7,
  },
  doneButton: {
    backgroundColor: 'rgba(100,100,100,0.9)',
    borderRadius: 10,
    padding: 10,
    margin: 7,
  },
  sideMenu: {
    backgroundColor: 'rgba(100,100,100,1)',
    borderRadius: 10,
    padding: 10,
    margin: 7,
    height: '100%',
  },
  containerStyles: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scrollView: {
    maxHeight: 228,
    width: 230,
  },
  textandlist: {
    backgroundColor: 'rgba(100,100,100)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 100,
    width: '100%',
    backgroundColor: 'red',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'rgba(50,50,50,1)',
    paddingVertical: 240,
    paddingHorizontal: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView2: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
    fontSize: 30,
  },
  addButton: {
    backgroundColor: 'grey',
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    top: 160,
    left: 60,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 30,
    marginTop: 3,
  },
  stickeLine: {
    height: 60,
    width: 'auto',
    backgroundColor: 'rgba(120,120,120,0.9)',
    margin: 5,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
  },
  stickerInput: {
    height: 40,
    width: '65%',
    backgroundColor: 'rgba(90,90,90,1)',
    borderRadius: 10,
    padding: 10,
    margin: 7,
  },
})
