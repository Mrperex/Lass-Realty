import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { api } from './src/lib/api';
import { saveToken, getToken, clearToken } from './src/lib/auth';

const { width } = Dimensions.get('window');

type Screen = 'login' | 'dashboard' | 'create-property' | 'listings' | 'scanner' | 'leads';

const DOC_TYPES = [
  { value: 'listing-agreement', label: 'Listing Agreement' },
  { value: 'contract', label: 'Contract' },
  { value: 'other', label: 'Other' },
];

type Property = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  city: string;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  status: string;
  images: string[];
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  'for-sale': '#22C55E',
  'reserved': '#F59E0B',
  'sold': '#EF4444',
};

const STATUS_LABELS: Record<string, string> = {
  'for-sale': 'For Sale',
  'reserved': 'Reserved',
  'sold': 'Sold',
};

const STATUS_CYCLE = ['for-sale', 'reserved', 'sold'];

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `$${(price / 1_000).toFixed(0)}K`;
  return `$${price}`;
}

// Leads
type Lead = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertySlug: string;
  status: string;
  notes: { text: string; createdAt: string; _id: string }[];
  createdAt: string;
};

const LEAD_STATUS_COLORS: Record<string, string> = {
  'new': '#3B82F6',
  'contacted': '#F59E0B',
  'qualified': '#22C55E',
  'closed': '#64748B',
};

const LEAD_STATUS_CYCLE = ['new', 'contacted', 'qualified', 'closed'];
const LEAD_FILTERS = ['all', 'new', 'contacted', 'qualified', 'closed'];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  // Property form state
  const [propTitle, setPropTitle] = useState('');
  const [propDescription, setPropDescription] = useState('');
  const [propPrice, setPropPrice] = useState('');
  const [propCity, setPropCity] = useState('');
  const [propBedrooms, setPropBedrooms] = useState('');
  const [propBathrooms, setPropBathrooms] = useState('');
  const [propSqm, setPropSqm] = useState('');
  const [propImages, setPropImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Listings state
  const [properties, setProperties] = useState<Property[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Scanner state
  const [scanDocType, setScanDocType] = useState('listing-agreement');
  const [scanUploading, setScanUploading] = useState(false);
  const [scanResult, setScanResult] = useState<{ url: string; type: string } | null>(null);

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsRefreshing, setLeadsRefreshing] = useState(false);
  const [leadFilter, setLeadFilter] = useState('all');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        setScreen('dashboard');
        fetchAnalytics();
      }
      setLoading(false);
    })();
  }, []);

  const handleLogin = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post('/auth/login', { password });
      if (res.data.token) {
        await saveToken(res.data.token);
        setScreen('dashboard');
        fetchAnalytics();
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Login failed. Check your connection.';
      Alert.alert('Authentication Failed', msg);
    } finally {
      setActionLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics-snapshot');
      setAnalytics(res.data);
    } catch (err: any) {
      console.warn('Analytics fetch error:', err.message);
    }
  };

  const handleLogout = async () => {
    await clearToken();
    setAnalytics(null);
    setPassword('');
    setProperties([]);
    setLeads([]); // Clear leads on logout
    setScreen('login');
  };

  // ==================== LISTINGS ====================
  const fetchProperties = async () => {
    setListingsLoading(true);
    try {
      const res = await api.get('/properties?limit=100');
      setProperties(res.data.properties || []);
    } catch (err: any) {
      console.warn('Fetch properties error:', err.message);
    } finally {
      setListingsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefreshListings = useCallback(() => {
    setRefreshing(true);
    fetchProperties();
  }, []);

  const togglePropertyStatus = async (id: string, currentStatus: string) => {
    const currentIdx = STATUS_CYCLE.indexOf(currentStatus);
    const nextStatus = STATUS_CYCLE[(currentIdx + 1) % STATUS_CYCLE.length];

    try {
      await api.put(`/admin/properties/${id}`, { status: nextStatus });
      setProperties((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: nextStatus } : p))
      );
    } catch (err: any) {
      Alert.alert('Update Failed', err.response?.data?.error || 'Could not update status.');
    }
  };

  const deleteProperty = async (id: string, title: string) => {
    Alert.alert(
      'Delete Property',
      `Are you sure you want to delete "${title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/admin/properties/${id}`);
              setProperties((prev) => prev.filter((p) => p._id !== id));
            } catch (err: any) {
              Alert.alert('Delete Failed', err.response?.data?.error || 'Could not delete.');
            }
          },
        },
      ]
    );
  };

  const navigateToListings = () => {
    setScreen('listings');
    fetchProperties();
  };

  // ==================== SCANNER ====================
  const uploadDocument = async (uri: string, mimeType: string, fileName: string) => {
    setScanUploading(true);
    setScanResult(null);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: mimeType,
        name: fileName,
      } as any);
      formData.append('type', scanDocType);

      const res = await api.post('/admin/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setScanResult({ url: res.data.document.url, type: res.data.document.type });
        Alert.alert('✅ Document Uploaded', `Saved as ${scanDocType.replace('-', ' ')}`);
      }
    } catch (err: any) {
      Alert.alert('Upload Failed', err.response?.data?.error || err.message || 'Could not upload.');
    } finally {
      setScanUploading(false);
    }
  };

  const scanWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.9 });
    if (!res.canceled) {
      const asset = res.assets[0];
      await uploadDocument(asset.uri, 'image/jpeg', `scan_${Date.now()}.jpg`);
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        await uploadDocument(asset.uri, asset.mimeType || 'application/pdf', asset.name || `doc_${Date.now()}`);
      }
    } catch (err: any) {
      Alert.alert('Picker Error', err.message);
    }
  };

  // ==================== LEADS ====================
  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const url = leadFilter === 'all' ? '/admin/leads' : `/admin/leads?status=${leadFilter}`;
      const res = await api.get(url);
      setLeads(res.data.leads || []);
    } catch (err: any) {
      console.warn('Fetch leads error:', err.message);
    } finally {
      setLeadsLoading(false);
      setLeadsRefreshing(false);
    }
  };

  const onRefreshLeads = useCallback(() => {
    setLeadsRefreshing(true);
    fetchLeads();
  }, [leadFilter]);

  const toggleLeadStatus = async (id: string, currentStatus: string) => {
    const currentIdx = LEAD_STATUS_CYCLE.indexOf(currentStatus);
    const nextStatus = LEAD_STATUS_CYCLE[(currentIdx + 1) % LEAD_STATUS_CYCLE.length];

    try {
      await api.put(`/admin/leads/${id}`, { status: nextStatus });
      setLeads((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status: nextStatus } : l))
      );
    } catch (err: any) {
      Alert.alert('Update Failed', err.response?.data?.error || 'Could not update lead status.');
    }
  };

  const addLeadNote = async (leadId: string) => {
    if (!noteText.trim()) return;

    try {
      const res = await api.put(`/admin/leads/${leadId}`, { note: noteText.trim() });
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? res.data.lead : l))
      );
      setNoteText('');
      setActiveNoteId(null);
    } catch (err: any) {
      Alert.alert('Note Failed', err.response?.data?.error || 'Could not add note.');
    }
  };

  const navigateLeads = (filter: string = 'all') => {
    setLeadFilter(filter);
    setScreen('leads');
    // Delay slightly to allow state to settle, then fetch
    setTimeout(() => fetchLeads(), 50);
  };

  // ==================== CLOUDINARY UPLOAD ====================
  const uploadToCloudinary = async (uri: string) => {
    setUploadingImage(true);
    try {
      const timestamp = Math.floor(Date.now() / 1000);

      const signRes = await api.post('/admin/cloudinary-sign', {
        paramsToSign: { timestamp },
      });

      const { signature, apiKey, cloudName } = signRes.data;

      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: `property_${Date.now()}.jpg`,
      } as any);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await uploadRes.json();

      if (data.secure_url) {
        setPropImages((prev) => [...prev, data.secure_url]);
      } else {
        Alert.alert('Upload Error', 'Cloudinary did not return a URL.');
      }
    } catch (err: any) {
      Alert.alert('Upload Failed', err.message || 'Could not upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo library access.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: true,
    });
    if (!res.canceled) {
      for (const asset of res.assets) {
        await uploadToCloudinary(asset.uri);
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled) {
      await uploadToCloudinary(res.assets[0].uri);
    }
  };

  const removeImage = (index: number) => {
    setPropImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetPropertyForm = () => {
    setPropTitle('');
    setPropDescription('');
    setPropPrice('');
    setPropCity('');
    setPropBedrooms('');
    setPropBathrooms('');
    setPropSqm('');
    setPropImages([]);
  };

  const handleCreateProperty = async () => {
    if (!propTitle.trim() || !propPrice.trim() || !propCity.trim()) {
      Alert.alert('Missing Fields', 'Title, Price, and City are required.');
      return;
    }
    if (!propDescription.trim()) {
      Alert.alert('Missing Fields', 'Description is required.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.post('/admin/properties', {
        title: propTitle.trim(),
        description: propDescription.trim(),
        price: Number(propPrice),
        city: propCity.trim(),
        bedrooms: Number(propBedrooms) || 0,
        bathrooms: Number(propBathrooms) || 0,
        squareMeters: Number(propSqm) || 0,
        status: 'for-sale',
        images: propImages,
      });

      if (res.data.success) {
        Alert.alert(
          '✅ Property Listed!',
          `"${propTitle}" is now live on lasspuntacana.com`,
          [{ text: 'OK', onPress: () => { resetPropertyForm(); setScreen('dashboard'); fetchAnalytics(); } }]
        );
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to create property.';
      Alert.alert('Create Failed', msg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D97706" />
      </View>
    );
  }

  // ==================== LOGIN SCREEN ====================
  if (screen === 'login') {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loginCard}>
          <Text style={styles.logo}>LASS</Text>
          <Text style={styles.logoSub}>REALTY OPERATOR</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Admin Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#64748B"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />
          </View>
          <TouchableOpacity
            style={[styles.primaryBtn, actionLoading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={actionLoading}
          >
            {actionLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Sign In</Text>}
          </TouchableOpacity>
          <Text style={styles.footerText}>Secure mobile operator access</Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // ==================== CREATE PROPERTY SCREEN ====================
  if (screen === 'create-property') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.createHeader}>
              <TouchableOpacity onPress={() => { resetPropertyForm(); setScreen('dashboard'); }} style={styles.backBtn}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.createTitle}>New Listing</Text>
            </View>

            {/* Form */}
            <View style={styles.formCard}>
              <Text style={styles.sectionLabel}>PROPERTY DETAILS</Text>

              <Text style={styles.fieldLabel}>Title *</Text>
              <TextInput style={styles.input} placeholder="e.g. Oceanview Villa Bavaro" placeholderTextColor="#475569" value={propTitle} onChangeText={setPropTitle} />

              <Text style={styles.fieldLabel}>Description *</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder="Describe the property..." placeholderTextColor="#475569" value={propDescription} onChangeText={setPropDescription} multiline numberOfLines={4} textAlignVertical="top" />

              <Text style={styles.fieldLabel}>Price (USD) *</Text>
              <TextInput style={styles.input} placeholder="750000" placeholderTextColor="#475569" value={propPrice} onChangeText={setPropPrice} keyboardType="numeric" />

              <Text style={styles.fieldLabel}>City *</Text>
              <TextInput style={styles.input} placeholder="Punta Cana" placeholderTextColor="#475569" value={propCity} onChangeText={setPropCity} />

              <View style={styles.row}>
                <View style={styles.halfField}>
                  <Text style={styles.fieldLabel}>Bedrooms</Text>
                  <TextInput style={styles.input} placeholder="4" placeholderTextColor="#475569" value={propBedrooms} onChangeText={setPropBedrooms} keyboardType="numeric" />
                </View>
                <View style={styles.halfField}>
                  <Text style={styles.fieldLabel}>Bathrooms</Text>
                  <TextInput style={styles.input} placeholder="3" placeholderTextColor="#475569" value={propBathrooms} onChangeText={setPropBathrooms} keyboardType="numeric" />
                </View>
              </View>

              <Text style={styles.fieldLabel}>Square Meters</Text>
              <TextInput style={styles.input} placeholder="280" placeholderTextColor="#475569" value={propSqm} onChangeText={setPropSqm} keyboardType="numeric" />
            </View>

            {/* Photos */}
            <View style={styles.formCard}>
              <Text style={styles.sectionLabel}>PHOTOS</Text>

              <View style={styles.photoActions}>
                <TouchableOpacity style={styles.photoBtn} onPress={takePhoto} disabled={uploadingImage}>
                  <Text style={styles.photoBtnIcon}>📷</Text>
                  <Text style={styles.photoBtnText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoBtn} onPress={pickImage} disabled={uploadingImage}>
                  <Text style={styles.photoBtnIcon}>🖼️</Text>
                  <Text style={styles.photoBtnText}>Gallery</Text>
                </TouchableOpacity>
              </View>

              {uploadingImage && (
                <View style={styles.uploadingBar}>
                  <ActivityIndicator size="small" color="#D97706" />
                  <Text style={styles.uploadingText}>Uploading to Cloudinary...</Text>
                </View>
              )}

              {propImages.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageStrip}>
                  {propImages.map((img, i) => (
                    <View key={i} style={styles.imageThumbWrap}>
                      <Image source={{ uri: img }} style={styles.imageThumb} />
                      <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(i)}>
                        <Text style={styles.removeImageText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}

              <Text style={styles.imageCount}>{propImages.length} photo{propImages.length !== 1 ? 's' : ''} attached</Text>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, actionLoading && styles.btnDisabled]}
              onPress={handleCreateProperty}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitBtnText}>🚀  Publish Listing</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // ==================== LISTINGS SCREEN ====================
  if (screen === 'listings') {
    const renderProperty = ({ item }: { item: Property }) => (
      <View style={styles.listingCard}>
        <View style={styles.listingRow}>
          {item.images && item.images.length > 0 ? (
            <Image source={{ uri: item.images[0] }} style={styles.listingThumb} />
          ) : (
            <View style={[styles.listingThumb, styles.listingThumbEmpty]}>
              <Text style={styles.listingThumbEmptyText}>📷</Text>
            </View>
          )}
          <View style={styles.listingInfo}>
            <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.listingCity}>{item.city}</Text>
            <View style={styles.listingMeta}>
              <Text style={styles.listingPrice}>{formatPrice(item.price)}</Text>
              <Text style={styles.listingDetails}>{item.bedrooms}bd · {item.bathrooms}ba · {item.squareMeters}m²</Text>
            </View>
          </View>
        </View>
        <View style={styles.listingActions}>
          <TouchableOpacity
            style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] || '#64748B' }]}
            onPress={() => togglePropertyStatus(item._id, item.status)}
          >
            <Text style={styles.statusBadgeText}>{STATUS_LABELS[item.status] || item.status}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteProperty(item._id, item.title)}>
            <Text style={styles.deleteBtnText}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.createHeader}>
          <TouchableOpacity onPress={() => setScreen('dashboard')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.createTitle}>My Listings</Text>
          <Text style={styles.listingCount}>{properties.length}</Text>
        </View>

        {listingsLoading && properties.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D97706" />
            <Text style={styles.loadingText}>Loading properties...</Text>
          </View>
        ) : (
          <FlatList
            data={properties}
            keyExtractor={(item) => item._id}
            renderItem={renderProperty}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefreshListings} tintColor="#D97706" />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🏗</Text>
                <Text style={styles.emptyText}>No properties yet</Text>
                <TouchableOpacity style={styles.primaryBtn} onPress={() => setScreen('create-property')}>
                  <Text style={styles.primaryBtnText}>Create First Listing</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>
    );
  }

  // ==================== SCANNER SCREEN ====================
  if (screen === 'scanner') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={styles.createHeader}>
            <TouchableOpacity onPress={() => setScreen('dashboard')} style={styles.backBtn}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.createTitle}>Scan Document</Text>
          </View>

          {/* Document Type Selector */}
          <View style={styles.formCard}>
            <Text style={styles.sectionLabel}>DOCUMENT TYPE</Text>
            <View style={styles.docTypeRow}>
              {DOC_TYPES.map((dt) => (
                <TouchableOpacity
                  key={dt.value}
                  style={[
                    styles.docTypeChip,
                    scanDocType === dt.value && styles.docTypeChipActive,
                  ]}
                  onPress={() => setScanDocType(dt.value)}
                >
                  <Text style={[
                    styles.docTypeChipText,
                    scanDocType === dt.value && styles.docTypeChipTextActive,
                  ]}>{dt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Capture Actions */}
          <View style={styles.formCard}>
            <Text style={styles.sectionLabel}>CAPTURE</Text>
            <View style={styles.photoActions}>
              <TouchableOpacity style={styles.photoBtn} onPress={scanWithCamera} disabled={scanUploading}>
                <Text style={styles.photoBtnIcon}>📸</Text>
                <Text style={styles.photoBtnText}>Camera</Text>
                <Text style={styles.scanHint}>Scan physical doc</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoBtn} onPress={pickDocument} disabled={scanUploading}>
                <Text style={styles.photoBtnIcon}>📁</Text>
                <Text style={styles.photoBtnText}>Files</Text>
                <Text style={styles.scanHint}>PDF or image</Text>
              </TouchableOpacity>
            </View>

            {scanUploading && (
              <View style={styles.uploadingBar}>
                <ActivityIndicator size="small" color="#D97706" />
                <Text style={styles.uploadingText}>Uploading document...</Text>
              </View>
            )}
          </View>

          {/* Result */}
          {scanResult && (
            <View style={styles.formCard}>
              <Text style={styles.sectionLabel}>✅ UPLOADED</Text>
              <View style={styles.scanResultBox}>
                <Text style={styles.scanResultType}>{scanResult.type.replace('-', ' ').toUpperCase()}</Text>
                <Text style={styles.scanResultUrl} numberOfLines={2}>{scanResult.url}</Text>
              </View>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => { setScanResult(null); }}>
                <Text style={styles.primaryBtnText}>Scan Another</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // ==================== LEADS CRM SCREEN ====================
  if (screen === 'leads') {
    const renderLead = ({ item }: { item: Lead }) => (
      <View style={styles.leadCard}>
        <View style={styles.leadHeader}>
          <Text style={styles.leadName}>{item.name}</Text>
          <TouchableOpacity
            style={[styles.leadStatusBadge, { backgroundColor: LEAD_STATUS_COLORS[item.status] || '#64748B', marginLeft: 'auto' }]}
            onPress={() => toggleLeadStatus(item._id, item.status)}
          >
            <Text style={styles.leadStatusText}>{item.status}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.leadContact}>📧 {item.email}</Text>
        {item.phone && <Text style={styles.leadContact}>📞 {item.phone}</Text>}
        <Text style={styles.leadMessage}>{item.message}</Text>
        <View style={styles.leadFooter}>
          <Text style={styles.leadProp}>Property: {item.propertySlug || 'N/A'}</Text>
          <Text style={styles.leadTime}>{timeAgo(item.createdAt)}</Text>
        </View>

        {/* Notes Section */}
        <View style={styles.notesContainer}>
          {(item.notes || []).map((note) => (
            <View key={note._id} style={styles.noteItem}>
              <Text style={styles.noteText}>{note.text}</Text>
              <Text style={styles.noteTime}>{timeAgo(note.createdAt)}</Text>
            </View>
          ))}
          {activeNoteId === item._id ? (
            <View style={styles.noteInputRow}>
              <TextInput
                style={styles.noteInput}
                placeholder="Add a note..."
                placeholderTextColor="#64748B"
                value={noteText}
                onChangeText={setNoteText}
                onSubmitEditing={() => addLeadNote(item._id)}
                autoFocus
              />
              <TouchableOpacity style={styles.noteSendBtn} onPress={() => addLeadNote(item._id)}>
                <Text style={styles.noteSendText}>↑</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setActiveNoteId(item._id)}>
              <Text style={styles.addNoteLink}>+ Add Note</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.createHeader}>
          <TouchableOpacity onPress={() => setScreen('dashboard')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.createTitle}>Leads Pipeline</Text>
          <Text style={styles.listingCount}>{leads.length}</Text>
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {LEAD_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.docTypeChip, // Reusing docTypeChip for styling
                leadFilter === filter && styles.docTypeChipActive,
                { marginRight: 8 }
              ]}
              onPress={() => setLeadFilter(filter)}
            >
              <Text style={[
                styles.docTypeChipText,
                leadFilter === filter && styles.docTypeChipTextActive,
              ]}>{filter.charAt(0).toUpperCase() + filter.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {leadsLoading && leads.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D97706" />
            <Text style={styles.loadingText}>Loading leads...</Text>
          </View>
        ) : (
          <FlatList
            data={leads}
            keyExtractor={(item) => item._id}
            renderItem={renderLead}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={leadsRefreshing} onRefresh={onRefreshLeads} tintColor="#D97706" />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🤷‍♂️</Text>
                <Text style={styles.emptyText}>No leads found for this filter.</Text>
              </View>
            }
          />
        )}
      </View>
    );
  }

  // ==================== DASHBOARD SCREEN ====================
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={false} onRefresh={fetchAnalytics} tintColor="#D97706" />}
      >
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.dashTitle}>LASS Operator</Text>
            <Text style={styles.dashSubtitle}>Mobile Console</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {analytics ? (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{analytics.totalProperties}</Text>
              <Text style={styles.statLabel}>Properties</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{analytics.activeListings}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{analytics.totalLeads}</Text>
              <Text style={styles.statLabel}>Leads</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{analytics.newLeads7d}</Text>
              <Text style={styles.statLabel}>New (7d)</Text>
            </View>
            <View style={[styles.statCard, styles.statCardWide]}>
              <Text style={styles.statNumber}>{analytics.topCity || '—'}</Text>
              <Text style={styles.statLabel}>Top City</Text>
            </View>
            <View style={[styles.statCard, styles.statCardWide]}>
              <Text style={styles.statNumber}>{Math.round(analytics.contactedRate * 100)}%</Text>
              <Text style={styles.statLabel}>Contacted</Text>
            </View>
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D97706" />
            <Text style={styles.loadingText}>Loading analytics...</Text>
          </View>
        )}

        <TouchableOpacity style={styles.refreshBtn} onPress={fetchAnalytics}>
          <Text style={styles.refreshText}>↻ Refresh Data</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={styles.quickActionsTitle}>QUICK ACTIONS</Text>

        <TouchableOpacity style={styles.actionCard} onPress={() => setScreen('create-property')}>
          <Text style={styles.actionIcon}>🏠</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>New Property Listing</Text>
            <Text style={styles.actionDesc}>Create listing with photos from camera</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={navigateToListings}>
          <Text style={styles.actionIcon}>📋</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Manage Listings</Text>
            <Text style={styles.actionDesc}>View, edit status, and delete properties</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => { setScanResult(null); setScreen('scanner'); }}>
          <Text style={styles.actionIcon}>📄</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Scan Agreement</Text>
            <Text style={styles.actionDesc}>Upload listing agreements and contracts</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => { navigateLeads('all'); }}>
          <Text style={styles.actionIcon}>💬</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Leads Pipeline</Text>
            <Text style={styles.actionDesc}>View, filter, and work your leads</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.connectionStatus}>✅ Connected to lasspuntacana.com</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { color: '#94A3B8', marginTop: 12, fontSize: 14 },

  // Login
  loginCard: { backgroundColor: '#1E293B', borderRadius: 24, padding: 32, borderWidth: 1, borderColor: '#334155' },
  logo: { fontSize: 48, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', letterSpacing: 8 },
  logoSub: { fontSize: 12, fontWeight: '600', color: '#D97706', textAlign: 'center', letterSpacing: 4, marginBottom: 32 },
  inputGroup: { marginBottom: 20 },
  label: { color: '#94A3B8', fontSize: 13, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: '#0F172A', borderRadius: 12, padding: 16, color: '#FFFFFF', fontSize: 16, borderWidth: 1, borderColor: '#334155' },
  textArea: { minHeight: 100, paddingTop: 16 },
  primaryBtn: { backgroundColor: '#D97706', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  footerText: { color: '#475569', fontSize: 12, textAlign: 'center', marginTop: 20 },

  // Dashboard
  dashboardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 24 },
  dashTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  dashSubtitle: { fontSize: 12, color: '#D97706', fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase' },
  logoutBtn: { backgroundColor: '#1E293B', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  logoutText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, width: '47%', borderWidth: 1, borderColor: '#334155' },
  statCardWide: { width: '47%' },
  statNumber: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  refreshBtn: { backgroundColor: '#1E293B', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16, borderWidth: 1, borderColor: '#334155' },
  refreshText: { color: '#D97706', fontSize: 14, fontWeight: '700' },
  connectionStatus: { color: '#22C55E', fontSize: 12, textAlign: 'center', marginTop: 16, opacity: 0.7 },

  // Quick Actions
  quickActionsTitle: { color: '#64748B', fontSize: 12, fontWeight: '700', letterSpacing: 2, marginTop: 28, marginBottom: 12 },
  actionCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#334155', marginBottom: 10 },
  actionIcon: { fontSize: 28, marginRight: 16 },
  actionInfo: { flex: 1 },
  actionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 2 },
  actionDesc: { color: '#64748B', fontSize: 12 },
  actionArrow: { color: '#D97706', fontSize: 20, fontWeight: '700' },

  // Create Property
  createHeader: { paddingTop: 60, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 16 },
  backBtnText: { color: '#D97706', fontSize: 16, fontWeight: '600' },
  createTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  formCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  sectionLabel: { color: '#D97706', fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 16 },
  fieldLabel: { color: '#94A3B8', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  row: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },

  // Photos
  photoActions: { flexDirection: 'row', gap: 12 },
  photoBtn: { flex: 1, backgroundColor: '#0F172A', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  photoBtnIcon: { fontSize: 28, marginBottom: 4 },
  photoBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  uploadingBar: { flexDirection: 'row', alignItems: 'center', marginTop: 12, padding: 12, backgroundColor: '#0F172A', borderRadius: 8 },
  uploadingText: { color: '#D97706', marginLeft: 10, fontSize: 13 },
  imageStrip: { marginTop: 12 },
  imageThumbWrap: { position: 'relative', marginRight: 10 },
  imageThumb: { width: 90, height: 90, borderRadius: 10 },
  removeImageBtn: { position: 'absolute', top: -6, right: -6, backgroundColor: '#EF4444', width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  removeImageText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  imageCount: { color: '#64748B', fontSize: 12, marginTop: 8 },
  submitBtn: { backgroundColor: '#D97706', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 4 },
  submitBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },

  // Listings
  listingCount: { color: '#64748B', fontSize: 14, fontWeight: '600', marginLeft: 'auto' },
  listingCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  listingRow: { flexDirection: 'row', marginBottom: 12 },
  listingThumb: { width: 72, height: 72, borderRadius: 10, marginRight: 14 },
  listingThumbEmpty: { backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center' },
  listingThumbEmptyText: { fontSize: 24 },
  listingInfo: { flex: 1, justifyContent: 'center' },
  listingTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 2 },
  listingCity: { color: '#94A3B8', fontSize: 13, marginBottom: 6 },
  listingMeta: { flexDirection: 'row', alignItems: 'center' },
  listingPrice: { color: '#D97706', fontSize: 16, fontWeight: '800', marginRight: 10 },
  listingDetails: { color: '#64748B', fontSize: 12 },
  listingActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  statusBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  deleteBtn: { padding: 8 },
  deleteBtnText: { fontSize: 20 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#64748B', fontSize: 16, marginBottom: 20 },

  // Scanner
  docTypeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  docTypeChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#334155' },
  docTypeChipActive: { backgroundColor: '#D97706', borderColor: '#D97706' },
  docTypeChipText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  docTypeChipTextActive: { color: '#FFFFFF' },
  scanHint: { color: '#475569', fontSize: 10, marginTop: 2 },
  scanResultBox: { backgroundColor: '#0F172A', borderRadius: 12, padding: 16, marginBottom: 12 },
  scanResultType: { color: '#22C55E', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  scanResultUrl: { color: '#64748B', fontSize: 11 },

  // Leads CRM
  filterRow: { marginBottom: 12, maxHeight: 40 },
  leadCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  leadHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  leadName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  leadContact: { color: '#94A3B8', fontSize: 12 },
  leadStatusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16 },
  leadStatusText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  leadMessage: { color: '#CBD5E1', fontSize: 13, marginBottom: 8, lineHeight: 18 },
  leadFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  leadProp: { color: '#64748B', fontSize: 11 },
  leadTime: { color: '#475569', fontSize: 11 },
  notesContainer: { borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 8, marginBottom: 6 },
  noteItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  noteText: { color: '#94A3B8', fontSize: 12, flex: 1, marginRight: 8 },
  noteTime: { color: '#475569', fontSize: 10 },
  noteInputRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  noteInput: { flex: 1, backgroundColor: '#0F172A', borderRadius: 10, padding: 10, color: '#FFFFFF', fontSize: 13, borderWidth: 1, borderColor: '#334155' },
  noteSendBtn: { backgroundColor: '#D97706', width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  noteSendText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  addNoteLink: { color: '#D97706', fontSize: 12, fontWeight: '600', marginTop: 4 },
});
