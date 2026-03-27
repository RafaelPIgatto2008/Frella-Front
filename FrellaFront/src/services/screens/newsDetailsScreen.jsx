import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LateralBar from '../components/LateralBar';
import { getNewsById } from '../NewsService';
import { styles } from '../styles/detailScreenStyle';

const normalizeNews = (newsItem) => ({
  title: newsItem?.title ?? newsItem?.Title ?? newsItem?.headline ?? newsItem?.Headline ?? '',
  description:
    newsItem?.description ??
    newsItem?.Description ??
    newsItem?.content ??
    newsItem?.Content ??
    newsItem?.text ??
    newsItem?.Text ??
    '',
  publishAt:
    newsItem?.publishAt ??
    newsItem?.PublishAt ??
    newsItem?.createdAt ??
    newsItem?.CreatedAt ??
    '',
});

export default function NewsDetailsScreen({
  onLogout,
  navigationItems,
  initialNewsId = '',
  onProfilePress,
}) {
  const [newsId, setNewsId] = useState(initialNewsId ? String(initialNewsId) : '');
  const [newsData, setNewsData] = useState(null);
  const [isLoadingNews, setIsLoadingNews] = useState(Boolean(initialNewsId));
  const [newsError, setNewsError] = useState('');

  const loadNews = async (targetId) => {
    if (!targetId.trim()) {
      setNewsError('Informe um ID de noticia.');
      setNewsData(null);
      return;
    }

    try {
      setIsLoadingNews(true);
      setNewsError('');
      const response = await getNewsById(targetId.trim());
      setNewsData(normalizeNews(response));
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Falha ao carregar a noticia.';
      setNewsError(errorMsg);
      setNewsData(null);
    } finally {
      setIsLoadingNews(false);
    }
  };

  useEffect(() => {
    if (initialNewsId) {
      loadNews(String(initialNewsId));
    }
  }, [initialNewsId]);

  return (
    <View style={styles.container}>
      <LateralBar
        profileInitials="RP"
        profileName="User"
        profileRole="Seu perfil"
        navigationItems={navigationItems}
        onProfilePress={onProfilePress}
        onLogout={onLogout}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Noticia por ID</Text>
        <Text style={styles.subtitle}>
          Abra os detalhes completos de uma noticia especifica pelo seu identificador.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Buscar noticia</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Informe o ID da noticia"
              placeholderTextColor="#8B95A7"
              value={newsId}
              onChangeText={setNewsId}
            />
            <TouchableOpacity
              style={[styles.primaryButton, isLoadingNews && styles.primaryButtonDisabled]}
              onPress={() => loadNews(newsId)}
              disabled={isLoadingNews}
            >
              <Text style={styles.primaryButtonText}>
                {isLoadingNews ? 'Buscando...' : 'Buscar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Detalhes da noticia</Text>

          {isLoadingNews ? (
            <View style={styles.statusBox}>
              <ActivityIndicator size="large" color="#2C8C99" />
              <Text style={styles.statusText}>Carregando noticia...</Text>
            </View>
          ) : newsError ? (
            <View style={styles.statusBox}>
              <Text style={styles.errorText}>{newsError}</Text>
            </View>
          ) : !newsData ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>Nenhuma noticia carregada.</Text>
            </View>
          ) : (
            <>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Titulo</Text>
                <Text style={styles.fieldValue}>{newsData.title || 'Nao informado'}</Text>
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Descricao</Text>
                <Text style={styles.fieldValue}>{newsData.description || 'Nao informado'}</Text>
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Publicado em</Text>
                <Text style={styles.fieldValue}>{newsData.publishAt || 'Nao informado'}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
