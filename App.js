import React from 'react';
import { Image, View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

////////////////////////////////////////////////////////////////////////
// Oi professor :), Fiz o código em ingles por costume mesmo         //
// Também comentei pois faz parte das boas praticas e pretendo      //
// colocar esse projeto no meu portfólio.                          //      
// Vou deixar o link aqui inclusive se quiser dar uma olhada      //
//                                                               //
// Link Portfólio: https://my-portfolio-six-kappa-14.vercel.app/ //
//////////////////////////////////////////////////////////////////


// Login page

//main consts
const LoginForm = ({ username, password, setUsername, setPassword, handleLogin, goToRegister, errorMessage }) => (
  //Login components
  <View style={styles.container}>
    <Image 
        source={require('./assets/mainilustration.png')} // Caminho da imagem local
        style={styles.image}
        resizeMode="contain"
      />
    <Text style={styles.title}> Welcome to RecebaX </Text>
    <Text style={styles.subtitle}> Enter your User and Password! </Text>
    <TextInput
      style={styles.input}
      placeholder="Usuario"
      value={username}
      onChangeText={setUsername}
    />
    <TextInput
      style={styles.input}
      placeholder="Password"
      value={password}
      secureTextEntry
      onChangeText={setPassword}
    />
    <TouchableOpacity style={styles.button} onPress={handleLogin}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.link} onPress={goToRegister}>
      <Text style={styles.linkText}>Register</Text>
    </TouchableOpacity>
    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
  </View>
);

// Register page
const RegisterForm = ({ username, password, setUsername, setPassword, handleRegister, goToLogin, errorMessage }) => (
  <View style={styles.container}>
    <Image 
        source={require('./assets/registerilustration.png')} // Caminho da imagem local
        style={styles.image}
        resizeMode="contain"
      />
    <TextInput
      style={styles.input}
      placeholder="New Username"
      value={username}
      onChangeText={setUsername}
    />
    <TextInput
      style={styles.input}
      placeholder="New Password"
      value={password}
      secureTextEntry
      onChangeText={setPassword}
    />
    <TouchableOpacity style={styles.button} onPress={handleRegister}>
      <Text style={styles.buttonText}>Register</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.link} onPress={goToLogin}>
      <Text style={styles.linkText}>Back to Login</Text>
    </TouchableOpacity>
    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
  </View>
);


// Welcome page
const homeIcon = require('./assets/home.png');
const storeIcon = require('./assets/store.png');
const profileIcon = require('./assets/profile.png');
const settingsIcon = require('./assets/settings.png');
const logoutIcon = require('./assets/logout.png');

const WelcomePage = ({ navigation, handleLogout }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Image source={logoutIcon} style={styles.icon} 
            resizeMode="center"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}> Your logged In! </Text>
      </View>
      
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Image source={homeIcon} style={styles.icon} 
          resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Store')}>
          <Image source={storeIcon} style={styles.icon} 
          resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Image source={profileIcon} style={styles.icon} 
          resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
          <Image source={settingsIcon} style={styles.icon} 
          resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

//background code
const App = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isRegistering, setIsRegistering] = React.useState(false); // Novo estado para o registro

  //check active session
  React.useEffect(() => {
    checkSession();
  }, []);

//check username
  const checkSession = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('username');
      if (savedUsername) {
        setUsername(savedUsername);
        setIsLoggedIn(true);
      }
    } catch (error) {
      setErrorMessage('Error: ' + error);
    }
  };

  const handleLogin = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('username');
      const savedPassword = await AsyncStorage.getItem('password');

      if (username === savedUsername && password === savedPassword) {
        setIsLoggedIn(true);
        setErrorMessage('');
      } else {
        setErrorMessage('Invalid username or password.');
      }
    } catch (error) {
      setErrorMessage('Error: ' + error);
    }
  };

//check blank register
  const handleRegister = async () => {
    if (!username || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    // set and storage username and password if both are blank, error comes out
    try {
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
      setIsRegistering(false);
      setErrorMessage('');
      setUsername('');
      setPassword('');
    } catch (error) {
      setErrorMessage('Error: ' + error);
    }
  };

// logout user
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('password');
      setIsLoggedIn(false);
      setUsername('');
      setPassword('');
    } catch (error) {
      setErrorMessage('Error: ' + error);
    }
  };

//external bakcup
  return (
    <View style={styles.external}>
      {isLoggedIn ? (
        <WelcomePage username={username} handleLogout={handleLogout} />
      ) : isRegistering ? (
        <RegisterForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleRegister={handleRegister}
          goToLogin={() => setIsRegistering(false)}
          errorMessage={errorMessage}
        />
      ) : (
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
          goToRegister={() => setIsRegistering(true)}
          errorMessage={errorMessage}
        />
      )}
    </View>
  );
};

//Style Sheets
const styles = StyleSheet.create({
  external: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 0,
    color: "#4abf88",
    fontWeight: 500,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    color: "#4abf88",
    fontWeight: 400,
  },
  input: {
    height: 50,
    borderColor: '#4abf88',
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 10,
    padding: 10,
    width: '80%',
    color: '#4abf88',
    fontWeight: 500,
  },
  image: {
    width: "100%",
    height: '40%',
  },
  button: {
    width: '70%',
    paddingVertical: 10,
    backgroundColor: '#4abf88',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 600,
    fontSize: 16,
  },
  link: {
    width: '50%',
    paddingVertical: 5,
    backgroundColor: '#fffff',
    borderColor: '#4abf88',
    borderWidth: 2,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 15,
  },
  linkText: {
    color: '#4abf88',
    fontWeight: 600,
    fontSize: 12,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  navbar: {
    width: "107%",
    height: "7%",
    flexDirection: 'row',
    backgroundColor: '#4abf88',
    paddingVertical: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 20,
  },
  navItem: {
    padding: 10,
  },
  icon: {
    width: '32px',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
header: {
    width: '100%',
    height: '7%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    position: 'absolute',
    backgroundColor: '#4abf88',
    top: -5,
    left: 0,
    borderRadius: 5,
  },
  logoutButton: {
    padding: 5,
  },
});

export default App;
