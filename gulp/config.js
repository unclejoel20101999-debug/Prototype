import { libs } from "./libs.js";

export default {
	add_watch: [
		/* {
			extname: "json",
			folder: "json",
			reload: true
		} */
	],
	paths: {
		build: {
			gitignore: ".gitignore",
			folder: ['./**', '!./node_modules/**', '!./package-lock.json'],
			main: "dist/**/*",
			html: 'dist',
			css: 'dist/css',
			js: 'dist/js',
			img: 'dist/img',
			fonts: 'dist/fonts',
			json: 'dist/json',
			audio: 'dist/audio',
			video: 'dist/video',
		},
		src: {
			html: 'app/*.html',
			html_components: 'app/html/**/*.html',
			scss: 'app/scss/style.scss',
			scss_folder: 'app/scss/',
			js: 'app/js/*.js',
			libs,
			img_avif: ['app/img/**/*.*', '!app/img/**/*.webp', '!app/img/**/*.svg'],
			img: ["app/img/**/*.*", '!app/img/sprites/*.svg'],
			img_folder: "app/img",
			sprites: "app/img/sprites/*.svg",
			fonts: 'app/fonts/**/*.{ttf,woff,woff2,eot,otf}',
		},
		watch: {
			html: 'app/**/*.html',
			scss: 'app/scss/**/*.scss',
			scss_folder: 'app/scss',
			js: 'app/js/**/*.js',
			js_folder: "app/js",
			html_folder: "app",
			fonts: 'app/fonts',
			img: ['app/img/**/*.{jpg,jpeg,png,gif,webp,svg}'],
			json: "app/json/*.json",
			json_folder: "app/json",
			video: "app/video/*.*",
			video_folder: "app/video",
			audio: "app/audio/*.*",
			audio_folder: "app/audio",
			sprites: "app/img/sprites/*.svg"
		},
		clean: './dist',
	},
	js_config: {
		output: {
			beautify: false,
			comments: false
		},
		compress: {
			passes: 3
		}
	},
	css_config: {
		preset: ["default", {
			discardComments: { removeAll: true },
			normalizeWhitespace: true,
			reduceIdents: true,
			mergeIdents: true,
			minifyFontValues: true,
		}]
	},
	autoprefixer_config: {
		overrideBrowserslist: [
			'> 1%',
			'last 2 versions',
			'Safari >= 13',
			'not dead'
		],
		cascade: false,
		grid: false
	},
	watcher: {
		ignored: /(^|[\/\\])\../,
		persistent: true,
		ignoreInitial: true,
		awaitWriteFinish: {
			stabilityThreshold: 200,
			pollInterval: 100
		}
	},
	sprites_config: {
		mode: {
			symbol: {
				sprite: '../sprites.svg',
				example: false
			}
		},
		shape: {
			transform: [
				{
					svgo: {
						plugins: [
							{ name: 'removeTitle', active: true },
							{ name: 'removeDesc', active: true },
							{ name: 'removeUselessDefs', active: true },
						]
					}
				}
			]
		}
	}
}