-- Custom SQL migration file, put you code below! --
INSERT INTO `images` (`image_id`, `created_at`, `user_email_id`)
VALUES
('sample0.jpeg', TIMESTAMP('2023-11-01'), 'potato@potato.com'),
('sample1.jpeg', TIMESTAMP('2023-11-02'), 'potato@potato.com'),
('sample2.jpeg', TIMESTAMP('2023-11-03'), 'foo@bar.com'),
('sample3.jpeg', TIMESTAMP('2023-11-04'), 'foo@bar.com'),
('sample4.jpeg', TIMESTAMP('2023-11-05'), 'test@abcd.com'),
('sample5.jpeg', TIMESTAMP('2023-11-06'), 'test@abcd.com');