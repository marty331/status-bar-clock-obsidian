import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface StatusBarClockSettings {
	showSeconds: boolean;
	showClock: boolean;
}

const DEFAULT_SETTINGS: StatusBarClockSettings = {
	showSeconds: true,
}

export default class StatusBarClockPlugin extends Plugin {
	settings: StatusBarClockSettings;
	rightNow: string;

	updateTime() {
		this.rightNow = new Date().toLocaleTimeString();
		
		if (!this.settings.showSeconds) {
			// Remove the seconds from the time string
			this.rightNow = this.rightNow.replace(/:\d{2} /, ' ');
		}
	}

	

	async onload() {
		await this.loadSettings();

		// This adds a clock to the status bar. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();

		this.registerInterval(
			window.setInterval(() => {
				this.updateTime();
				statusBarItemEl.setText(`Time: ${this.rightNow}`);
			}, 1000)
		);
		

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new StatusBarClockSettingsTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class StatusBarClockSettingsTab extends PluginSettingTab {
	plugin: StatusBarClockPlugin;

	constructor(app: App, plugin: StatusBarClockPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Show seconds')
			.setDesc('Show seconds in the time display')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showSeconds === true)
				.onChange(async (value) => {
					this.plugin.settings.showSeconds = value ? true : false;
					await this.plugin.saveSettings();
				}));
		
	}
}
