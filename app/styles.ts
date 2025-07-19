import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
  },
  headerGradient: {
    paddingTop: 0,
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
  headerContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 0,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#1B5E20',
    marginTop: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default styles;
