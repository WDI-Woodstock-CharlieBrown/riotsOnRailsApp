class Riot < ActiveRecord::Base
  scope :before_year, ->(year) { where("year < ?", year) }
  scope :after_year, ->(year) { where("year > ?", year) }
  scope :min_injuries, ->(number) { where("injuries > ?", number) }
  scope :max_injuries, ->(number) { where("injuries < ?", number) }
  scope :description_long, ->(word) { where("description_long ILIKE ?", "%#{word}%") }
  scope :description_short, ->(word) { where("description_short ILIKE ?", "%#{word}%")}
  scope :city_state, ->(word) {where("city_state ILIKE ?", "%#{word}%")}
end
