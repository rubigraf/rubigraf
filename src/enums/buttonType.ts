/**
 * Types of supported buttons.
 *
 * @package rubigraf
 * @since v1.0.0
 */
enum ButtonTypeEnum {
  /** Display the button normally */
  Simple = "Simple",
  /** Display buttons as a list */
  Selection = "Selection",
  /** Display button as calendar */
  Calendar = "Calendar",
  /** Display the button as a list of numbers */
  NumberPicker = "NumberPicker",
  /** Display button as a list of strings */
  StringPicker = "StringPicker",
  /** Display button for a location */
  Location = "Location",
  /** Show payment button */
  Payment = "Payment",
  /** Show button to take a photo with the camera */
  CameraImage = "CameraImage",
  /** Show button to record video with camera */
  CameraVideo = "CameraVideo",
  /** Show button to send photo from gallery */
  GalleryImage = "GalleryImage",
  /** Show button to send video from gallery */
  GalleryVideo = "GalleryVideo",
  /** Show button to send file */
  File = "File",
  /** Show button to send audio */
  Audio = "Audio",
  /** Show button to record audio */
  RecordAudio = "RecordAudio",
  /** Show button as user's phone number */
  MyPhoneNumber = "MyPhoneNumber",
  /** Show button as user's location */
  MyLocation = "MyLocation",
  /** Show button to enter text message */
  Textbox = "Textbox",
  /** Show button to send URL */
  Link = "Link",
  /** Show button to let user fill their phone number */
  AskMyPhoneNumber = "AskMyPhoneNumber",
  /** Show button to let user enter their location */
  AskLocation = "AskLocation",
  /** Show button to scan barcode */
  Barcode = "Barcode",
}

export { ButtonTypeEnum };
