import 'fast-text-encoding';
import 'react-native-url-polyfill/auto';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {http, HttpResponse, passthrough} from 'msw';
import {setupServer} from 'msw/native';

type Movie = {
  id: string;
  title: string;
  releaseYear: string;
};

const handlers = [
  http.get('https://reactnative.dev/movies.json', async () => {
    return HttpResponse.json(
      {
        title: 'The Basics - Networking',
        description: 'Your app fetched this from a remote endpoint!',
        movies: [
          {id: '1', title: 'Star Wars', releaseYear: '1977'},
          {id: '2', title: 'Back to the Future', releaseYear: '1985'},
          {id: '3', title: 'The Matrix', releaseYear: '1999'},
          {id: '4', title: 'Inception', releaseYear: '2010'},
          {id: '5', title: 'Interstellar', releaseYear: '2014'},
        ],
      },
      {status: 200, headers: {'Content-Type': 'application/json'}},
    );
  }),
  http.all('http://localhost:8081/*', passthrough),
  http.all('http://10.0.2.2:8081/*', passthrough),
];

const server = setupServer(...handlers);
server.listen();

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Movie[]>([]);

  const getMovies = async () => {
    try {
      const response = await fetch('https://reactnative.dev/movies.json');
      const json = await response.json();
      setData(json.movies);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, padding: 24}}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            keyExtractor={({id}) => id}
            renderItem={({item}) => (
              <Text>
                {item.title}, {item.releaseYear}
              </Text>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default App;
