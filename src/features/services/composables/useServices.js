import { ref, computed, readonly } from 'vue';
import { services as servicesData } from '../data/services.js';

// --- State (Singleton Pattern) ---
// By defining the state outside the composable function, it's created only once.
const services = ref(servicesData.sort((a, b) => a.name.localeCompare(b.name)));
const searchQuery = ref('');

const filteredServices = computed(() => {
  if (!searchQuery.value) {
    return services.value;
  }
  return services.value.filter(service =>
    service.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// --- Composable Function ---
export function useServices() {
  return {
    searchQuery,
    filteredServices,
  };
}
