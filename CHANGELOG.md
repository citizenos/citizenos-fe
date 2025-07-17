## 2025-07-15 - v1.3.11
  * Update: Issue FE#2331: IDEAS: Show number of ideas returned by ideas filters (and search)

## 2025-06-19 - v1.3.10
  * Fix: Issue FE #2302: IDEAS: Allow users to select multiple ages in age filter
  * Fix: Issue FE #2034: IDEAS: Add filters for demographic data

## 2025-06-18 - v1.3.9
  * Fix: Issue #1487 - SEARCH: Add 'No results found" message to search, and signpost to Help
  * Fix: Issue #1490 - TOPICS: 'Read more' button not as it should look - text pokes out underneath and margins too big
  * Fix: Issue #1537 - TOPICS: A more pleasing look when there is no image?
  * Fix: Issue #1685 - TOPIC: Idea gathering topic becomes a discussion topic if saved without a question
  * Fix: Issue #1712 - TOPIC: With 1 Discussion topic, the Edit button is not visible
  * Fix: Issue #2021 - IDEAS: Remove 'Edit idea' and 'Remove idea' from menu anonymous ideas
  * Fix: Issue #2139 - AF: Remove deleted draft ideas from activity feed
  * Fix: Issue #2180 - GROUPS: 'More info' not so visible on mobile
  * Fix: Issue #2187 - IDEAS/VOTING: Text about idea folder in the idea vote settings

## 2025-05-01 - v1.3.8
  * Feature: #2038 - IDEAS: Autosaving drafts

## 2025-04-29 - v1.3.7
  * Fix: Revert #2038 - IDEAS: Autosaving drafts

## 2025-04-21 - v1.3.6
  * Fix: Issue #2081 - fix demographics-prefix
## 2025-04-21 - v1.3.5
  * Fix: Issue #2038 - IDEAS: Autosaving drafts
  * Fix: Issue #2081 - IDEAS: Include both 'Other' and users open text field input in the CSV download
  * Fix: Issue #2216 - LOGIN: Communicate that password reset code expires after 1 hour
  * Fix: Issue #2218 - TOPICS: Error 'Not found' when entering topics in live
  * Fix: Issue #2222 - MODERATION: Page crashes for topic admin and platform moderator

## 2025-04-21 - v1.3.4
  * Fix: Issue #1811 - MOBILE: In iOS the reaction button for ideas is too small
  * Fix: Issue #1861 - ID VOTING: User got a 500 error when digitally signing
  * Fix: Issue #2020 - IDEAS: Remove reply button when replies are switched off
  * Fix: Issue #2087 - IDEA GATHERING: Images not added to anonymous ideas and HTTP error

## 2025-03-19 - v1.3.3
  * Fix: Issue #2070 - IDEAS: 'Other - please specify' option for Municipalities
  * Fix: Issue #2077 - MOBILE: Add Idea not visible after adding an image
  * Fix: Issue #2122 - MP: Sharing link doesn't work and gives an error message

## 2025-03-19 - v1.3.2
  * Fix: Authentication and redirection improvements
    - Enhanced logout functionality
    - Improved redirects after authentication
    - Fixed REST API redirects
  * Fix: Base URL handling and navigation updates
    - Improved URL creation and handling
    - Enhanced language-specific redirects
  * Localization: Updated translations for multiple languages
    - Updated translations for Estonian, Russian, German, French, Spanish and other languages
    - Improved language-specific content and messaging
  * Fix: Enhanced idea demographic fields editing functionality
  * Fix: Various UI and styling improvements

## 2025-03-12 - v1.3.1
  * Feature: Enhanced idea submission form with improved demographic data collection
    - Added gender selection dropdown
    - Added municipality selection dropdown
    - Improved age field validation
  * UI/UX: Improved form controls and styling
    - Enhanced dropdown styles and interactions
    - Updated CTA (Call to Action) visibility
    - Improved resize logic for better responsiveness
  * Fix: Improved form validation and restrictions
    - Enhanced numeric input validation
    - Updated residence list functionality
  * Fix: Resolved inviteId property handling issues
  * Fix: Various UI and language-specific improvements

## 2025-03-05 - 1.3.0
  * Feature: Anonymous idea gatherings - ideas are posted anonymously and not connected to any user
  * Feature: Ask extra demographic information to anonymous idea gatherings
  * Feature: User can create idea drafts - for anonymous idea gatherings idea connection with user is removed after posting
  * Feature: Disable replies for ideas
  * Feature: Allow users to create templates for anonymous ideas
  * FIX: Invite and join flow UX/UI updates
  * FIX: Issue FE #658 - IDEA GATHERING: Back button causes navigation issues when you've opened idea(s)
  * FIX: Issue FE #1248 - IDEATION / AF: Clicking new idea activity doesn't take me to the topic
  * FIX: Issue FE #1463 - VOTING: Refresh needed to get vote signing results
  * FIX: Issue FE #1636 - IDEA GATHERING: When not logged in, clicking 'reply' leads button to disappear
  * FIX: Issue FE #1637 - DISCUSSIONS: When not logged in, argument 'reply' buttons are missing
  * FIX: Issue FE #1639 - IDEA GATHERING: When not logged in, 'like idea' button is greyed out, should be active but trigger login pop-up
  * FIX: Issue FE #1656 - GROUP: Public topics not showing up as added to public group in all places they should
  * FIX: Issue FE #1782 - MISC: Consistency of filters UI/UX
  * FIX: Issue FE #1797 - MISC: No access to privacy policy on the platform itself
  * FIX: Issue FE #1820 - GROUPS: Navigating between topics in groups
  * FIX: Issue FE #1863 - IDEA GATHERING: Broken formatting options on mobile
  * FIX: Issue FE #1873 - IS: QR code 'right click to save' doesn't work in all browsers
  * FIX: Issue FE #1980 - ACTIONS: Duplicate edit topic causing issues

## 2025-01-31 - v1.2.4
  * Fix: Issue #1839 - TOPICS: Partially hide email addresses shown to topic admins in the 'Invited' tab

## 2025-01-31 - v1.2.3
  * Fix: Issue #1819 - TOPICS: Don't show topic admin email addresses

## 2025-01-29 - v1.2.2
  * Fix: Issue #307 - Add participants to public topics automatically when they engage (add idea, like, vote, etc)
  * Fix: Issue #1657 - GROUPS: Bugs in last edit and/or order of public topics displayed within public group
  * Fix: Issue #1678 - TOUR: 'Topic discussion' part of tour not relevant during other phases and slides off to top left corner
  * Fix: Issue #1680 - TOUR: Add 'the page you're on offers a walkthrough' to Help panel for DB and all screen sizes
  * Fix: Issue #1684 - TOPIC: Adding actions doesn't lock the topic
  * Fix: Issue #1737 - AF: Clicking on 'liked an idea' update in Topic AF takes you to DB
  * Fix: Issue #1739 - TOPICS: In topics starting with idea gathering, 'File too large' message not showing for header image uploads
  * Fix: Issue #1796 - MISC: 'About' button broken - leads to 404 page

## 2025-01-15 - v1.2.1
  * Fix: Issue #1653 - TOPICS: No way to close long filter dropdowns on mobile except back button, which take you too far back
  * Fix: Issue #1654 - TOPICS: On mobile, filter buttons need to be 'active' all the way across

## 2025-01-08 - v1.2.0
  * Lot of bug fixes
  * Improved ideation/idea-gathering functionality
  * Improved group invite functionality
  * Improved topic notification settings
  * Improved topic view

## 2024-07-29 - v1.1.0
  * Feature: New ideation/idea-gathering functionality
  * Update: Angular framework upgraded to version 18
  * Update: Node.js upgraded to version 20
  * Fix: Multiple UX and performance improvements

## 2024-04-10 - v1.0.3
  * Fix: Topic vote creation race condition resolved - status change synchronization
  * Fix: Issue #1102 - L10n: text width needs to be flexible
  * Fix: Issue #1099 - VOTING: Mobile user can add Arguments in a Voting Topic
  * Fix: Issue #1046 - Topic: Wrong notification message for 'Save as draft'.
  * Fix: Issue #1006 - Discussion: Wording for removed replies - should be contribution
  * Fix: Issue #1004 - Discussion: Character limit duplicated and 2 different numbers
  * Fix: Issue #996 - Discussion: When post an empty reply, get told it is too long

## 2024-04-10 - v1.0.2
  * Feature: Group topic request system MVP implemented (#186)
  * Fix: Issue #1096 - Email: Formatting inconsistency
  * Fix: Issue #1092 - GROUP: Requested topic is not greyed out
  * Fix: Issue #1084 - GROUP: Clicking on Accept a Topic from email leads to a blank page
  * Fix: Issue #1083 - Emails: Gap needed in Request to add topic emails
  * Fix: Issue #1081 - Group: Code in the Group Activity Feed
  * Fix: Issue #1080 - GROUP: Clicking Accept for Add Topic to Group leads to a confusing view
  * Fix: Issue #1073 - Topic - Create/edit topic groups list includes groups that you cannot add topic to
  * Fix: Issue #963 - Topic: Tooltip for attachments info

## 2024-03-27 - v1.0.1
  * Performance: Removed vote results from group member topics
  * Performance: Removed topic list ordering params causing performance issues
  * Fix: Mobile topic filter handling improved
  * Fix: Draft topics now redirect to edit view when opened in read view
  * Fix: Double interrupt dialog in topic deletion flow resolved
  * Fix: Issue #1065 - Public Topics->Hidden by Admin->Why not working
  * Fix: Issue #1060 - GROUP: User cannot remove group from topic
  * Fix: Issue #1059 - GROUP: Add Topics not working
  * Fix: Issue #1055 - Topics: Public topics default sorting is misleading (due to 'Last edit' bug?)
  * Fix: Issue #1054 - HELP: Comments and non-compulsory email causing confusion
  * Fix: Issue #1044 - Topics: Close without saving button (X) not working

## 2024-03-18 - v1.0.0
  * Feature: Complete UX/UI redesign
