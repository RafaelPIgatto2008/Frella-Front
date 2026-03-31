import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native';
import LateralBar from '../components/LateralBar';
import MotionButton from '../components/MotionButton';
import { getAllNews, getNewsById } from '../NewsService';
import { styles } from '../styles/detailScreenStyle';

const normalizeNews = (newsItem) => ({
  id: newsItem?.id ?? newsItem?.Id ?? newsItem?.newsId ?? newsItem?.NewsId ?? '',
  title: newsItem?.title ?? newsItem?.Title ?? newsItem?.headline ?? newsItem?.Headline ?? 'Sem titulo',
  description:
    newsItem?.description ??
    newsItem?.Description ??
    newsItem?.content ??
    newsItem?.Content ??
    newsItem?.text ??
    newsItem?.Text ??
    'Sem descricao.',
  publishAt:
    newsItem?.publishAt ??
    newsItem?.PublishAt ??
    newsItem?.createdAt ??
    newsItem?.CreatedAt ??
    '',
});

export default function NewsScreen({
  onLogout,
  navigationItems,
  onBackHome,
  onOpenNewsDetails,
  onProfilePress,
}) {
  const [news, setNews] = useState([]);
  const [selectedNewsId, setSelectedNewsId] = useState('');
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [isSearchingNews, setIsSearchingNews] = useState(false);
  const [newsError, setNewsError] = useState('');

  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoadingNews(true);
        setNewsError('');
        const response = await getAllNews();
        const rawNews = Array.isArray(response) ? response : [];

        setNews(rawNews.map(normalizeNews));
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Falha ao carregar noticias.';
        setNewsError(errorMsg);
      } finally {
        setIsLoadingNews(false);
      }
    };

    loadNews();
  }, []);

  const handleSearchNews = async () => {
    if (!selectedNewsId.trim()) {
      return;
    }

    try {
      setIsSearchingNews(true);
      setNewsError('');
      const response = await getNewsById(selectedNewsId.trim());
      onOpenNewsDetails?.(response?.id ?? response?.Id ?? selectedNewsId.trim());
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Falha ao localizar a noticia.';
      setNewsError(errorMsg);
    } finally {
      setIsSearchingNews(false);
    }
  };

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
        <Text style={styles.title}>Noticias</Text>
        <Text style={styles.subtitle}>
          Consulte as noticias publicadas e abra os detalhes de um item especifico pelo ID.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Buscar noticia por ID</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Informe o ID da noticia"
              placeholderTextColor="#8B95A7"
              value={selectedNewsId}
              onChangeText={setSelectedNewsId}
            />
            <MotionButton
              style={[styles.primaryButton, isSearchingNews && styles.primaryButtonDisabled]}
              onPress={handleSearchNews}
              disabled={isSearchingNews}
              disabledStyle={styles.primaryButtonDisabled}
            >
              <Text style={styles.primaryButtonText}>
                {isSearchingNews ? 'Buscando...' : 'Abrir'}
              </Text>
            </MotionButton>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ultimas noticias</Text>

          {isLoadingNews ? (
            <View style={styles.statusBox}>
              <ActivityIndicator size="large" color="#2C8C99" />
              <Text style={styles.statusText}>Carregando noticias...</Text>
            </View>
          ) : newsError ? (
            <View style={styles.statusBox}>
              <Text style={styles.errorText}>{newsError}</Text>
            </View>
          ) : news.length === 0 ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>Nenhuma noticia encontrada.</Text>
            </View>
          ) : (
            news.map((newsItem, index) => (
              <View key={`${newsItem.id || newsItem.title}-${index}`} style={styles.itemCard}>
                <Text style={styles.itemTitle}>{newsItem.title}</Text>
                <Text style={styles.itemDescription}>{newsItem.description}</Text>
                {newsItem.publishAt ? (
                  <Text style={styles.metaText}>Publicado em: {newsItem.publishAt}</Text>
                ) : null}

                <MotionButton
                  style={styles.primaryButton}
                  onPress={() => onOpenNewsDetails?.(newsItem.id)}
                  disabled={!newsItem.id}
                  disabledStyle={styles.primaryButtonDisabled}
                >
                  <Text style={styles.primaryButtonText}>
                    {newsItem.id ? 'Ver detalhes' : 'ID indisponivel'}
                  </Text>
                </MotionButton>
              </View>
            ))
          )}

          <View style={styles.actionsRow}>
            <MotionButton style={[styles.secondaryButton, styles.flexButton]} onPress={onBackHome}>
              <Text style={styles.secondaryButtonText}>Voltar para home</Text>
            </MotionButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
