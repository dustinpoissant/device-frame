export default class DeviceFrame extends HTMLElement {
	static get observedAttributes() {
		return ['src', 'device', 'controls', 'orientation', 'scaled', 'devices'];
	}

	static devices = {
		iphone15promax: {
			name: 'iPhone 15 Pro Max',
			resolution: [430, 932],
			topFrameSize: 15,
			bottomFrameSize: 15,
			sideFrameSize: 15,
			innerRadius: 27,
			outerRadius: 40
		},
		iphone15pro: {
			name: 'iPhone 15 Pro',
			resolution: [393, 852],
			topFrameSize: 15,
			bottomFrameSize: 15,
			sideFrameSize: 15,
			innerRadius: 27,
			outerRadius: 40
		},
		iphone15: {
			name: 'iPhone 15',
			resolution: [393, 852],
			topFrameSize: 15,
			bottomFrameSize: 15,
			sideFrameSize: 15,
			innerRadius: 27,
			outerRadius: 40
		},
		iphonese: {
			name: 'iPhone SE',
			resolution: [320, 568],
			topFrameSize: 15,
			bottomFrameSize: 15,
			sideFrameSize: 15,
			innerRadius: 25,
			outerRadius: 38
		},
		galaxys22ultra: {
			name: 'Galaxy S22 Ultra',
			resolution: [360, 772],
			topFrameSize: 10,
			bottomFrameSize: 10,
			sideFrameSize: 10,
			innerRadius: 18,
			outerRadius: 25
		},
		galaxys22plus: {
			name: 'Galaxy S22+',
			resolution: [360, 780],
			topFrameSize: 10,
			bottomFrameSize: 10,
			sideFrameSize: 10,
			innerRadius: 18,
			outerRadius: 25
		},
		galaxys22: {
			name: 'Galaxy S22',
			resolution: [360, 780],
			topFrameSize: 10,
			bottomFrameSize: 10,
			sideFrameSize: 10,
			innerRadius: 18,
			outerRadius: 25
		},
		galaxytabs9: {
			name: 'Galaxy Tab S9',
			resolution: [1280, 800],
			topFrameSize: 20,
			bottomFrameSize: 20,
			sideFrameSize: 20,
			innerRadius: 15,
			outerRadius: 30
		},
		galaxytaba8: {
			name: 'Galaxy Tab A8',
			resolution: [800, 1280],
			topFrameSize: 20,
			bottomFrameSize: 20,
			sideFrameSize: 20,
			innerRadius: 12,
			outerRadius: 25
		},
		pixel8: {
			name: 'Pixel 8',
			resolution: [412, 915],
			topFrameSize: 12,
			bottomFrameSize: 12,
			sideFrameSize: 12,
			innerRadius: 20,
			outerRadius: 28
		},
		pixelfold: {
			name: 'Pixel Fold',
			resolution: [904, 2208],
			closedResolution: [408, 1104],
			topFrameSize: 18,
			bottomFrameSize: 18,
			sideFrameSize: 18,
			innerRadius: 22,
			outerRadius: 35
		},
		galaxyfold: {
			name: 'Galaxy Z Fold5',
			resolution: [1812, 2176],
			closedResolution: [744, 1612],
			topFrameSize: 20,
			bottomFrameSize: 20,
			sideFrameSize: 20,
			innerRadius: 25,
			outerRadius: 40
		},
		pixeltablet: {
			name: 'Pixel Tablet',
			resolution: [1600, 2560],
			topFrameSize: 25,
			bottomFrameSize: 25,
			sideFrameSize: 25,
			innerRadius: 18,
			outerRadius: 40
		},
		ipadpro12: {
			name: 'iPad Pro 12.9"',
			resolution: [1024, 1366],
			topFrameSize: 20,
			bottomFrameSize: 20,
			sideFrameSize: 15,
			innerRadius: 18,
			outerRadius: 35
		},
		ipadpro10: {
			name: 'iPad Pro 10.5"',
			resolution: [834, 1112],
			topFrameSize: 18,
			bottomFrameSize: 18,
			sideFrameSize: 15,
			innerRadius: 18,
			outerRadius: 35
		},
		ipadair4: {
			name: 'iPad Air 4',
			resolution: [1180, 820],
			topFrameSize: 20,
			bottomFrameSize: 20,
			sideFrameSize: 15,
			innerRadius: 18,
			outerRadius: 35
		},
		ipad10: {
			name: 'iPad 10.2"',
			resolution: [810, 1080],
			topFrameSize: 18,
			bottomFrameSize: 18,
			sideFrameSize: 15,
			innerRadius: 18,
			outerRadius: 35
		}
	};

	constructor(props = {}) {
		super();
		this.attachShadow({ mode: 'open' });
		this._src = '';
		this._device = 'iphone15';
		this._controls = [];
		this._orientation = 'portrait';
		this._folded = false; // false = open
		this._scaled = false;
		this._devices = null; // null means show all devices

		// Apply props if provided
		if (props.src !== undefined) this.src = props.src;
		if (props.device !== undefined) this.device = props.device;
		if (props.controls !== undefined) this.controls = props.controls;
		if (props.orientation !== undefined) this.orientation = props.orientation;
		if (props.scaled !== undefined) this.scaled = props.scaled;
		if (props.devices !== undefined) this.devices = props.devices;
	}

	get src() {
		return this._src;
	}

	set src(value) {
		this._src = value;
		this.setAttribute('src', value);
		this.render();
	}

	get device() {
		return this._device;
	}

	set device(value) {
		const oldValue = this._device;
		this._device = value;
		this._folded = false; // reset to open when device changes
		
		// Calculate default orientation based on resolution
		const device = DeviceFrame.devices[value] || DeviceFrame.devices['iphone15'];
		const [width, height] = device.resolution;
		this._orientation = width > height ? 'landscape' : 'portrait';
		
		this.setAttribute('device', value);
		this.render();
		
		if (oldValue !== value) {
			this.dispatchEvent(new CustomEvent('devicechange', {
				detail: { device: value, previousDevice: oldValue }
			}));
		}
	}

	get controls() {
		return this._controls.join(',');
	}

	set controls(value) {
		const oldValue = this._controls.join(',');
		this._controls = value ? value.split(',').map(c => c.trim().toLowerCase()).filter((c, i, arr) => arr.indexOf(c) === i) : [];
		const newValue = this._controls.join(',');
		this.setAttribute('controls', newValue);
		this.render();
		
		if (oldValue !== newValue) {
			this.dispatchEvent(new CustomEvent('controlschange', {
				detail: { controls: this._controls, previousControls: oldValue.split(',') }
			}));
		}
	}

	get orientation() {
		return this._orientation;
	}

	set orientation(value) {
		const oldValue = this._orientation;
		this._orientation = value;
		this.setAttribute('orientation', value);
		this.render();
		
		if (oldValue !== value) {
			this.dispatchEvent(new CustomEvent('orientationchange', {
				detail: { orientation: value, previousOrientation: oldValue }
			}));
		}
	}

	get scaled() {
		return this._scaled;
	}

	set scaled(value) {
		const oldValue = this._scaled;
		this._scaled = value;
		if (value) {
			this.setAttribute('scaled', '');
		} else {
			this.removeAttribute('scaled');
		}
		this.render();
		
		if (oldValue !== value) {
			this.dispatchEvent(new CustomEvent('scalechange', {
				detail: { scaled: value, previousScaled: oldValue }
			}));
		}
	}

	get devices() {
		return this._devices ? this._devices.join(',') : '';
	}

	set devices(value) {
		const oldValue = this._devices ? this._devices.join(',') : '';
		this._devices = value ? value.split(',').map(d => d.trim()).filter(d => d) : null;
		const newValue = this._devices ? this._devices.join(',') : '';
		if (this._devices) {
			this.setAttribute('devices', this._devices.join(','));
		} else {
			this.removeAttribute('devices');
		}
		this.render();
		
		if (oldValue !== newValue) {
			this.dispatchEvent(new CustomEvent('deviceschange', {
				detail: { devices: this._devices, previousDevices: oldValue ? oldValue.split(',') : [] }
			}));
		}
	}

	get iframe() {
		return this.shadowRoot?.querySelector('iframe');
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'src') {
			this._src = newValue;
		} else if (name === 'device') {
			this._device = newValue;
			this._folded = false; // reset to open
			
			// Calculate default orientation based on resolution
			const device = DeviceFrame.devices[newValue] || DeviceFrame.devices['iphone15'];
			const [width, height] = device.resolution;
			this._orientation = width > height ? 'landscape' : 'portrait';
		} else if (name === 'controls') {
			this._controls = newValue ? newValue.split(',').map(c => c.trim().toLowerCase()).filter((c, i, arr) => arr.indexOf(c) === i) : [];
		} else if (name === 'orientation') {
			this._orientation = newValue || 'portrait';
		} else if (name === 'scaled') {
			this._scaled = this.hasAttribute('scaled');
		} else if (name === 'devices') {
			this._devices = newValue ? newValue.split(',').map(d => d.trim()).filter(d => d) : null;
		}
		this.render();
	}

	connectedCallback() {
		this.render();
	}

	render() {
		// Clear previous light DOM children
		while (this.firstChild) {
			this.removeChild(this.firstChild);
		}

		const device = DeviceFrame.devices[this._device] || DeviceFrame.devices['iphone15'];
		let [width, height] = this._folded && device.closedResolution ? device.closedResolution : device.resolution;
		if (this._orientation === 'landscape') {
			[width, height] = [height, width];
		}

		let scale = 1;
		if (this._scaled) {
			const deviceWidth = width + 2 * device.sideFrameSize;
			const deviceHeight = height + device.topFrameSize + device.bottomFrameSize;
			const targetScale = this._orientation === 'portrait' 
				? (0.8 * window.innerHeight) / deviceHeight 
				: (0.8 * window.innerWidth) / deviceWidth;
			scale = Math.min(1, targetScale);
		}

		// Create selects in light DOM with slots
		const controlsDiv = document.createElement('div');
		controlsDiv.className = 'controls-container';
		controlsDiv.slot = 'controls';

		if (this._controls.includes('device')) {
			const select = document.createElement('select');
			select.className = 'device-picker';
			const allDeviceKeys = Object.keys(DeviceFrame.devices);
			const deviceKeys = this._devices ? allDeviceKeys.filter(key => this._devices.includes(key)) : allDeviceKeys;
			const options = deviceKeys.map(key => 
				`<option value="${key}" ${key === this._device ? 'selected' : ''}>${DeviceFrame.devices[key].name}</option>`
			).join('');
			select.innerHTML = options;
			controlsDiv.appendChild(select);
			select.addEventListener('change', (e) => {
				this.device = e.target.value;
			});
		}

		if (this._controls.includes('orientation')) {
			const select = document.createElement('select');
			select.className = 'orientation-picker';
			select.innerHTML = `<option value="portrait" ${this._orientation === 'portrait' ? 'selected' : ''}>Portrait</option><option value="landscape" ${this._orientation === 'landscape' ? 'selected' : ''}>Landscape</option>`;
			controlsDiv.appendChild(select);
			select.addEventListener('change', (e) => {
				this.orientation = e.target.value;
			});
		}

		if (this._controls.includes('fold') && device.closedResolution) {
			const select = document.createElement('select');
			select.className = 'fold-picker';
			select.innerHTML = `<option value="open" ${!this._folded ? 'selected' : ''}>Open</option><option value="closed" ${this._folded ? 'selected' : ''}>Closed</option>`;
			controlsDiv.appendChild(select);
			select.addEventListener('change', (e) => {
				this._folded = e.target.value === 'closed';
				this.render();
			});
		}

		if (this._controls.includes('scaled')) {
			const label = document.createElement('label');
			label.className = 'scaled-toggle';
			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.checked = this._scaled;
			checkbox.addEventListener('change', (e) => {
				this.scaled = e.target.checked;
			});
			label.appendChild(checkbox);
			label.appendChild(document.createTextNode(' Scaled'));
			controlsDiv.appendChild(label);
		}

		this.appendChild(controlsDiv);

		// Render device in shadow DOM
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
				}
				::slotted(.controls-container) {
					margin-bottom: var(--spacer, 1rem);
					display: flex;
					gap: var(--spacer, 1rem);
					align-items: center;
				}
				::slotted(.scaled-toggle) {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					margin: 0;
				}
				.container {
					position: relative;
					width: ${(width + 2 * device.sideFrameSize) * scale}px;
					height: ${(height + device.topFrameSize + device.bottomFrameSize) * scale}px;
				}
				.device {
					position: absolute;
					top: 0;
					left: 0;
					width: ${width + 2 * device.sideFrameSize}px;
					height: ${height + device.topFrameSize + device.bottomFrameSize}px;
					border-radius: ${device.outerRadius}px;
					background: #000;
					padding: ${device.topFrameSize}px ${device.sideFrameSize}px ${device.bottomFrameSize}px;
					box-sizing: border-box;
					transform: scale(${scale});
					transform-origin: top left;
				}
				.screen {
					width: 100%;
					height: 100%;
					border-radius: ${device.innerRadius}px;
					overflow: hidden;
					background: #fff;
				}
				iframe {
					width: 100%;
					height: 100%;
					border: none;
				}
			</style>
			<slot name="controls"></slot>
			<div class="container">
				<div class="device">
					<div class="screen">
						<iframe src="${this._src}"></iframe>
					</div>
				</div>
			</div>
		`;

		// Attach load event listener to iframe
		const iframe = this.shadowRoot.querySelector('iframe');
		if (iframe) {
			iframe.addEventListener('load', () => {
				this.dispatchEvent(new CustomEvent('load', {
					detail: { iframe, src: this._src }
				}));
			});
		}
	}
}

window.customElements.define('device-frame', DeviceFrame);