-- Custom SQL migration file, put you code below! --
INSERT INTO
    `messages` (`message_json`, `user_email_id`, `image_id`)
VALUES
    (
        '{
            "content": "[이런 책 어떠세요?] 해리 포터와 함께 떠나는 마법 같은 첫 모험! 영생의 비밀을 품은 ‘마법사의 돌’을 찾아 나선 해리와 친구들의 이야기를 만나보세요. 지금 바로 주문하세요!",
            "targetCount": "2",
            "targets": ["01012345678", "01098765432"]
        }',
        'foo@bar.com',
        'sample2.jpeg'
    ),
    (
        '{
            "content": "[이런 책 어떠세요?] 혹시 마법 세계로의 초대장을 기다려 본 적이 있나요? 열한 살 소년 해리가 호그와트에 입학하며 시작되는 스펙터클한 모험, 해리 포터와 마법사의 돌에서 직접 확인하세요!",
            "targetCount": "2",
            "targets": ["01012345678", "01098765432"]
        }',
        'foo@bar.com',
        'sample3.jpeg'
    ),
    (
        '{
            "content": "[이런 책 어떠세요?] 고아로 자란 해리, 그리고 그의 인생을 바꾼 호그와트 입학! 잊을 수 없는 모험과 우정이 가득한 해리 포터와 마법사의 돌, 지금 함께 하세요!",
            "targetCount": "2",
            "targets": ["01012345678", "01098765432"]
        }',
        'foo@bar.com',
        'sample6.jpeg'
    ),
    (
        '{
            "content": "[이런 책 어떠세요?] 해리 포터와 함께 떠나는 마법 같은 첫 모험! 영생의 비밀을 품은 ‘마법사의 돌’을 찾아 나선 해리와 친구들의 이야기를 만나보세요. 지금 바로 주문하세요!",
            "targetCount": "2",
            "targets": ["01012345678", "01098765432"]
        }',
        'foo@bar.com',
        'sample7.jpeg'
    ),
    (
        '{
            "content": "[이런 책 어떠세요?] 혹시 마법 세계로의 초대장을 기다려 본 적이 있나요? 열한 살 소년 해리가 호그와트에 입학하며 시작되는 스펙터클한 모험, 해리 포터와 마법사의 돌에서 직접 확인하세요!",
            "targetCount": "2",
            "targets": ["01012345678", "01098765432"]
        }',
        'foo@bar.com',
        'sample8.jpeg'
    ),
    (
        '{
            "content": "[이런 책 어떠세요?] 고아로 자란 해리, 그리고 그의 인생을 바꾼 호그와트 입학! 잊을 수 없는 모험과 우정이 가득한 해리 포터와 마법사의 돌, 지금 함께 하세요!",
            "targetCount": "2",
            "targets": ["01012345678", "01098765432"]
        }',
        'foo@bar.com',
        'sample9.jpeg'
    );