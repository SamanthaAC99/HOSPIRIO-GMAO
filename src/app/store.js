import { configureStore,combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice';
import ordenReducer from '../features/ordenes/ordenSlice';
import inventarioReducer from '../features/inventario/inventarioSlice';
import reporteReducer from '../features/reportesi/reportesSlice';
import externoReducer from '../features/externos/externoSlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'auth',
  storage,
}

const persistConfig2 = {
  key: 'orden',
  storage,
}

const persistConfig3 = {
  key: 'inventario',
  storage,
}

const persistConfig4 = {
  key: 'reporte',
  storage,
}

const persistConfig5 = {
  key: 'externo',
  storage,
}

const persistedReducer = persistReducer(persistConfig,authReducer);
const persistedReducer2 = persistReducer(persistConfig2,ordenReducer);
const persistedReducer3 = persistReducer(persistConfig3,inventarioReducer);
const persistedReducer4 = persistReducer(persistConfig4,reporteReducer);
const persistedReducer5 = persistReducer(persistConfig5,externoReducer);

const reducers = combineReducers({
  auths:persistedReducer,
  ordens:persistedReducer2,
  inventarios:persistedReducer3,
  reporte:persistedReducer4,
  externo:persistedReducer5
})
const store = configureStore({
  reducer:reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    
  })
  let persistor = persistStore(store)

export {store,persistor}; 