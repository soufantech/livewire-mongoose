const { DuplicatedInboxMessageError } = require('livewire');
const { isDuplicatedDocumentMongoError } = require('./helpers');
const MessageInbox = require('./models/MessageInbox');

module.exports = () => {

  /**
   * Implements `livewire.InboxStorageAdapter` interface.
   */
  const save = async (message, { session }) => {
    try {
      await MessageInbox.create([message.metadata], { session });
    } catch (err) {
      if (isDuplicatedDocumentMongoError(err)) {
        throw new DuplicatedInboxMessageError({
          message: message,
          originalError: err
        });
      }

      throw err;
    }
  };

  return {
    save,
  };
};
