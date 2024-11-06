-- Custom SQL migration file, put you code below! --
INSERT INTO `messages` (`message_json`, `user_email_id`, `image_id`)
VALUES
('{"subject": "This is title", "content": "This is content", "targetCount": "2", "targets": ["01012345678", "01098765432"]}', 'foo@bar.com', 'sample2.jpeg');