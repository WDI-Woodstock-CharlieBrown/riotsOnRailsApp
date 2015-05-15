
namespace :data do
  desc "Import race riots"
  task :riots => :environment do
    require 'CSV'

    filename = Dir.glob("#{Rails.root}/Riots.csv")

    puts 'LOADING.....'
  	CSV.foreach(filename, :headers => true) do |row|
      riot = Riot.create!(row.to_hash)
      puts row.to_hash
    end
  end
end
