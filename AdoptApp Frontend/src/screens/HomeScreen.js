import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useAuth } from "../contexts/AuthProvider";
import PostCard from "../components/PostCard";
import { usePosts } from "../contexts/PostProvider";
import config from '../../config';
const apiUrl = config.API_URL;


const HomeScreen = ({ navigation }) => {
    const [filtro, setFiltro] = useState('Adopción');
    const [posts, setPosts] = useState([]);
    const { getUserId } = useAuth();
    const { getPostsByType } = usePosts();
    
    // Función para mapear el filtro a un valor de URL
    const getFilterValueForUrl = (filtro) => {
        switch (filtro) {
            case 'Adopción':
                return 'adopt';
            case 'Búsqueda':
                return 'lost';
            case 'Informativa':
                return 'informative';
            default:
                return '';
        }
    };

    // Construye la URL con el valor de filtro mapeado
    const url = `${apiUrl}/api/posts/type/${getFilterValueForUrl(filtro)}`;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.filterButtonContainer}>
                    <Menu>
                        <MenuTrigger style={styles.filterButton}>
                            <Text style={styles.filterButtonText}>{filtro}</Text>
                            <Ionicons name="chevron-down" size={20} color="#000" />
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={() => setFiltro('Adopción')} text='Adopción' />
                            <MenuOption onSelect={() => setFiltro('Búsqueda')} text='Búsqueda' />
                            <MenuOption onSelect={() => setFiltro('Informativa')} text='Informativa' />
                        </MenuOptions>
                    </Menu>
                </View>
            ),
            headerTitleAlign: 'left',
        });
    }, [navigation, filtro]);

    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const type = getFilterValueForUrl(filtro);
            const response = await getPostsByType(type);
            if (response && Array.isArray(response)) {
              setPosts(response);
            } else {
              console.error("Respuesta inesperada:", response);
            }
          } catch (error) {
            console.error("Error al obtener los posts:", error);
          }
        };
      
        fetchPosts();
      }, [filtro]);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            {posts.length === 0 ? (
                <View style={styles.noPostsContainer}>
                <Text style={styles.noPostsText}>No hay publicaciones actualmente</Text>
                </View>
            ) : (
                <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PostCard post={item} navigation={navigation}/>}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    noPostsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noPostsText: {
        fontSize: 18,
        color: '#888',
    },
    filterButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10, // Añade un poco de padding para facilitar la presión del botón
    },
    filterButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 5, // Añade espacio entre el texto y el icono
    },
});

export default HomeScreen;
