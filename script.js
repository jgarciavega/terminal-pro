// Terminal Pro JavaScript
class TerminalPro {
    constructor() {
        this.ships = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadMockData();
        this.loadWeatherData();
        this.updateBusinessStats();
        this.renderShips();
    }

    // Mock data for ships - in real implementation this would come from a database
    loadMockData() {
        this.ships = [
            {
                id: 1,
                nombre: "MV Esperanza",
                tipo: "Carguero",
                bandera: "Panamá",
                status: "en-puerto",
                puerto: "Puerto Principal",
                arribo: "2024-01-15 08:30",
                zarpe: "2024-01-16 14:00",
                carga: "Contenedores",
                tonelaje: "45,000 TN",
                compania: "Naviera del Pacífico"
            },
            {
                id: 2,
                nombre: "MS Libertad",
                tipo: "Petrolero",
                bandera: "Colombia",
                status: "en-transito",
                puerto: "En ruta a Puerto Norte",
                arribo: "2024-01-16 10:15",
                zarpe: "2024-01-17 16:30",
                carga: "Petróleo crudo",
                tonelaje: "80,000 TN",
                compania: "Petromarine S.A."
            },
            {
                id: 3,
                nombre: "Stella Marina",
                tipo: "Pesquero",
                bandera: "Ecuador",
                status: "otro-puerto",
                puerto: "Puerto Secundario",
                arribo: "2024-01-14 16:45",
                zarpe: "2024-01-15 06:00",
                carga: "Productos pesqueros",
                tonelaje: "12,000 TN",
                compania: "Flota Pesquera del Sur"
            },
            {
                id: 4,
                nombre: "Ocean Pioneer",
                tipo: "Granelero",
                bandera: "Liberia",
                status: "en-puerto",
                puerto: "Puerto Principal",
                arribo: "2024-01-15 12:20",
                zarpe: "2024-01-16 20:45",
                carga: "Granos",
                tonelaje: "60,000 TN",
                compania: "Global Shipping Co."
            },
            {
                id: 5,
                nombre: "Coral Reef",
                tipo: "Crucero",
                bandera: "Bahamas",
                status: "en-transito",
                puerto: "Aproximándose",
                arribo: "2024-01-16 18:00",
                zarpe: "2024-01-17 08:00",
                carga: "Pasajeros",
                tonelaje: "25,000 TN",
                compania: "Caribbean Cruises"
            },
            {
                id: 6,
                nombre: "Majestic Voyager",
                tipo: "Portacontenedores",
                bandera: "Singapur",
                status: "otro-puerto",
                puerto: "Puerto Internacional",
                arribo: "2024-01-13 09:30",
                zarpe: "2024-01-14 15:15",
                carga: "Contenedores",
                tonelaje: "95,000 TN",
                compania: "Asian Maritime Lines"
            }
        ];
    }

    // Load weather data - using a simple weather API (OpenWeatherMap)
    async loadWeatherData() {
        const weatherContainer = document.getElementById('weather-info');
        
        try {
            // For demo purposes, I'll use mock weather data
            // In production, you would use: const API_KEY = 'your-api-key';
            // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Puerto&appid=${API_KEY}&units=metric&lang=es`);
            
            // Mock weather data for demonstration
            const weatherData = {
                name: "Puerto Principal",
                main: {
                    temp: 28,
                    feels_like: 31,
                    humidity: 75,
                    pressure: 1013
                },
                weather: [{
                    description: "parcialmente nublado",
                    icon: "02d"
                }],
                wind: {
                    speed: 4.5,
                    deg: 220
                },
                visibility: 10000
            };

            this.renderWeatherData(weatherData);
        } catch (error) {
            console.error('Error loading weather data:', error);
            weatherContainer.innerHTML = '<div class="error">Error al cargar datos meteorológicos</div>';
        }
    }

    renderWeatherData(data) {
        const weatherContainer = document.getElementById('weather-info');
        
        weatherContainer.innerHTML = `
            <div class="weather-card">
                <h3><i class="fas fa-thermometer-half"></i> Temperatura</h3>
                <div class="temp">${data.main.temp}°C</div>
                <div class="description">Sensación térmica: ${data.main.feels_like}°C</div>
            </div>
            <div class="weather-card">
                <h3><i class="fas fa-eye"></i> Condiciones</h3>
                <div class="description" style="font-size: 1.1rem; margin-top: 0.5rem;">
                    ${data.weather[0].description}
                </div>
                <div class="description">Visibilidad: ${data.visibility/1000} km</div>
            </div>
            <div class="weather-card">
                <h3><i class="fas fa-wind"></i> Viento</h3>
                <div class="temp">${data.wind.speed} m/s</div>
                <div class="description">Dirección: ${data.wind.deg}°</div>
            </div>
            <div class="weather-card">
                <h3><i class="fas fa-tint"></i> Humedad</h3>
                <div class="temp">${data.main.humidity}%</div>
                <div class="description">Presión: ${data.main.pressure} hPa</div>
            </div>
        `;
    }

    renderShips() {
        const shipsContainer = document.getElementById('ships-container');
        let filteredShips = this.ships;

        if (this.currentFilter !== 'all') {
            filteredShips = this.ships.filter(ship => ship.status === this.currentFilter);
        }

        if (filteredShips.length === 0) {
            shipsContainer.innerHTML = '<div class="loading">No hay buques que coincidan con el filtro seleccionado.</div>';
            return;
        }

        const shipsHTML = filteredShips.map(ship => {
            const statusClass = `status-${ship.status}`;
            const statusText = {
                'en-puerto': 'En Puerto',
                'en-transito': 'En Tránsito',
                'otro-puerto': 'Otro Puerto'
            }[ship.status];

            const statusIcon = {
                'en-puerto': 'fas fa-anchor',
                'en-transito': 'fas fa-route',
                'otro-puerto': 'fas fa-map-marker-alt'
            }[ship.status];

            return `
                <div class="ship-card" data-status="${ship.status}">
                    <h3><i class="fas fa-ship"></i> ${ship.nombre}</h3>
                    <div class="ship-status ${statusClass}">
                        <i class="${statusIcon}"></i> ${statusText}
                    </div>
                    <div class="ship-details">
                        <p><strong>Tipo:</strong> ${ship.tipo}</p>
                        <p><strong>Bandera:</strong> ${ship.bandera}</p>
                        <p><strong>Puerto:</strong> ${ship.puerto}</p>
                        <p><strong>Arribo:</strong> ${this.formatDateTime(ship.arribo)}</p>
                        <p><strong>Zarpe:</strong> ${this.formatDateTime(ship.zarpe)}</p>
                        <p><strong>Carga:</strong> ${ship.carga}</p>
                        <p><strong>Tonelaje:</strong> ${ship.tonelaje}</p>
                        <p><strong>Compañía:</strong> ${ship.compania}</p>
                    </div>
                </div>
            `;
        }).join('');

        shipsContainer.innerHTML = shipsHTML;
    }

    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    updateBusinessStats() {
        const shipsInPort = this.ships.filter(ship => ship.status === 'en-puerto').length;
        const shipsInTransit = this.ships.filter(ship => ship.status === 'en-transito').length;
        const totalOperations = this.ships.length;
        const upcomingArrivals = this.ships.filter(ship => 
            ship.status === 'en-transito' || 
            (ship.status === 'otro-puerto' && new Date(ship.arribo) > new Date())
        ).length;

        document.getElementById('ships-in-port').textContent = shipsInPort;
        document.getElementById('ships-in-transit').textContent = shipsInTransit;
        document.getElementById('total-operations').textContent = totalOperations;
        document.getElementById('upcoming-arrivals').textContent = upcomingArrivals;
    }

    filterByStatus(status) {
        this.currentFilter = status;
        this.renderShips();
        
        // Update button states
        document.querySelectorAll('.controls .btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }

    showAllShips() {
        this.currentFilter = 'all';
        this.renderShips();
        
        // Update button states
        document.querySelectorAll('.controls .btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }
}

// Global functions for button interactions
function showAllShips() {
    terminalPro.showAllShips();
}

function filterByStatus(status) {
    terminalPro.filterByStatus(status);
}

// Initialize the application when DOM is loaded
let terminalPro;
document.addEventListener('DOMContentLoaded', function() {
    terminalPro = new TerminalPro();
    
    // Auto-refresh weather data every 5 minutes
    setInterval(() => {
        terminalPro.loadWeatherData();
    }, 300000);
    
    // Auto-refresh business stats every minute
    setInterval(() => {
        terminalPro.updateBusinessStats();
    }, 60000);
});