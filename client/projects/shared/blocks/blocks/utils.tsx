import JSX from '../../utils/jsx.compiler';

export const IMAGE_DEFINITION = {
	component: {
		type: 'image',
		configuration: {
			uploadMethods: [{
				id: 'file-manager',
				label: 'FILE_MANAGER.TITLE',
				component: JSX(<jms-e-file-manager-select/>),
				configuration: {
					hidePath: false,
					hideFolders: false,
					allowUpload: false,
					filters: [{
						value: file => file.contentType.startsWith('image/')
					}]
				}
			}]
		}
	}
};