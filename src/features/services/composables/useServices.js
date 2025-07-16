import { ref, readonly } from 'vue';
import { services as servicesData } from '../data/services.js';

const services = ref(servicesData);

export function useServices() {
  return {
    services: readonly(services),
  };
}
