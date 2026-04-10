import {
  Component,
  OnInit,
  NgZone,
  signal,
  computed,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { OpenWeatherData } from '../../../models/weather';
import { HeadingPipe } from '../../pipes/heading/heading.pipe';
import { FadeInOutAnimation } from '../../animations/animations';
import { WeatherModalPopupComponent } from './weather-modal-popup/weather-modal-popup.component';

// TODO: move API key out of source before production use.
const apiKey = '145bb2f5e2aab2c4aedbb3c32d0b3bc2';

type Coordinates = { latitude: number; longitude: number };
// Default weather location for the template.
const location: Coordinates = { latitude: 37.21533, longitude: -93.29824 };

enum Units {
  imperial,
  metric,
}

@Component({
  standalone: true,
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
  imports: [HeadingPipe, DatePipe, DecimalPipe,WeatherModalPopupComponent],
  animations: [FadeInOutAnimation],
})
export class WeatherComponent implements OnInit, OnDestroy {
  // Modal reference for expanded forecast view.
  popup = viewChild<WeatherModalPopupComponent>('modalPopup'); 
  // Toggles rendering after data has loaded.
  visible = signal(false);

  readonly city = 'Springfield, MO';

  compassStyle = computed(
    () => `rotate(${this.weatherData().current.wind_deg}deg)`);

  weatherData = signal(new OpenWeatherData());

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    // Initial weather fetch; can also be refreshed on a timer/user action.
    this.fetchOpenWeatherData(location, Units.imperial, apiKey);
  }

  ngOnDestroy(): void {
  }

  // Fetches weather from OpenWeather and updates widget state.
  fetchOpenWeatherData(coordinates: Coordinates, units: Units, apiKey: string) {
    fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=${Units[units]}&appid=${apiKey}`
    )
      .then(
        (response) =>
          response.json() as Promise<OpenWeatherData>
      )
      .then((data) => {
        this.ngZone.run(() => {
          this.weatherData.set(data);
          this.visible.set(true);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  open() {
    this.popup()?.open();
  }
}
