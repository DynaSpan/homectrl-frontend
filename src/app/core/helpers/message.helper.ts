export class MessageHelper {
    /**
     * Shows a floating message on the page
     * @param messageType enum indicating the message type
     * @param message the message itself (HTML sensitive!)
     */
    static showFloatingMessage(messageType: MessageType, message: string) {
        var randomId = Math.round(Math.random() * 10000).toString();
        
        var messageEl = document.createElement('div');
        messageEl.className = 'message float hidden';
        messageEl.id = 'message_float_' + randomId;

        switch (messageType) {
            case MessageType.Success:
                messageEl.className += ' success';
                messageEl.innerHTML = '<i class="fas fa-check"></i> ' + message;
                break;
            case MessageType.Error:
                messageEl.className += ' error';
                messageEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + message;
                break;
        }

        var container = this.createMessageContainer();

        messageEl.innerHTML += '<i class="fas fa-times clickable" id="close_message_float_' + randomId + '"></i>';
        container.appendChild(messageEl);
        messageEl.classList.remove('hidden');

        document.getElementById('close_message_float_' + randomId).onclick = _ => this.closeFloatingMessage(randomId);

        setTimeout(_ => this.closeFloatingMessage(randomId), 10000);
    }

    /**
     * Closes a floating message
     * @param messageId 
     */
    static closeFloatingMessage(messageId: string) {
        var message = document.getElementById('message_float_' + messageId);
        message.classList.add('hidden');

        // Wait for CSS animations to finish
        setTimeout(_ => message.remove(), 500);
    }

    /**
     * Checks if the container holding the messages exists
     */
    private static doesMessageContainerExists(): boolean {
        return document.getElementById('float-message-container') != undefined;
    }

    /**
     * Creates a new message container
     */
    private static createMessageContainer(): HTMLDivElement {
        if (this.doesMessageContainerExists()) 
            return document.getElementById('float-message-container') as HTMLDivElement;

        var messageContainer = document.createElement('div');
        messageContainer.className = 'float-message-container';
        messageContainer.id = 'float-message-container';

        document.body.appendChild(messageContainer);

        return messageContainer;
    }
}

export enum MessageType {
    Success,
    Error
}