I18n::Backend::Simple.include(I18n::Backend::Pluralization)
I18n.backend.store_translations :ru, i18n: {
  plural: {
    rule: lambda do |n|
      if n == 1
        :one
      elsif [2, 3, 4].include?(n)
        :few
      else
        :other
      end
    end
  }
}
I18n.backend.store_translations :ru, fw_errors: { one: '%{count} ошибку', few: '%{count} ошибки', other: '%{count} ошибок' }
I18n.backend.store_translations :en, fw_errors: { one: '%{count} error', other: '%{count} errors' }
